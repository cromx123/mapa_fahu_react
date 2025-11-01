import React, { useEffect, useMemo, useRef, useState } from "react";
import { nodeIcons } from "../utils/mapIcons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  ArrowUp,
  CornerDownRight,
  CornerDownLeft,
  RefreshCw,
  MapPin,
  Share2,
  Bookmark,
  Square,
  Play,
  Route,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import useCampusMap from "../hooks/useCampusMapController";
import CameraFollow from "./CameraFollow";
import HeadingLocationMarkerLion from "./HeadingLocationMarker";
import DrawerMenu from "./DrawerMenu"; 
import { useAppSettings } from "../context/SettingsContext";


// Fix de iconos Leaflet (CRA)
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const INITIAL_CENTER = [-33.447343, -70.684989];
const INITIAL_ZOOM = 17;

function MapEventBridge({ onMapEvent }) {
  useMapEvents({
    moveend: (e) => onMapEvent?.({ type: "moveend", target: e.target }),
    zoomend: (e) => onMapEvent?.({ type: "zoomend", target: e.target }),
    click: (e) => onMapEvent?.({ type: "click", latlng: e.latlng }),
  });
  return null;
}

function FitRoute({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 1) {
      const b = L.latLngBounds(points);
      map.fitBounds(b, { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
}

function MyLocationMarker({ coord }) {
  if (!coord) return null;
  return (
    <>
      <Marker position={[coord.lat, coord.lng]} />
    </>
  );
}

function FlyToPoint({ coord }) {
  const map = useMap();
  useEffect(() => {
    if (coord) {
      map.flyTo(coord, 19, { duration: 0.8 });
    }
  }, [coord, map]);
  return null;
}


function ControlBar({ setUserCoord }) {
  const map = useMap();

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserCoord({ lat: latitude, lng: longitude, accuracy });
        map.flyTo([latitude, longitude], Math.max(map.getZoom(), 18), { duration: 0.4 });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="absolute bottom-5 right-5 z-[1000] flex items-center gap-2 pointer-events-auto">
      <button
        onClick={() => map.zoomOut()}
        className="rounded-lg border bg-white px-3 py-2 shadow hover:bg-gray-50"
        title="Alejar"
      >
        −
      </button>
      <button
        onClick={() => {
          if (!navigator.geolocation) return;
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude, accuracy } = pos.coords;
              setUserCoord({ lat: latitude, lng: longitude, accuracy });
              map.flyTo([latitude, longitude], Math.max(map.getZoom(), 18), { duration: 0.4 });

              //seguir usuario SOLO si él lo pidió
              // setFollowUser(true);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 8000 }
          );
        }}
        className="rounded-lg border bg-white px-3 py-2 shadow hover:bg-gray-50"
        title="Mi ubicación"
      >
        ⦿
      </button>
      <button
        onClick={() => map.zoomIn()}
        className="rounded-lg border bg-white px-3 py-2 shadow hover:bg-gray-50"
        title="Acercar"
      >
        +
      </button>
    </div>
  );
}

export default function CampusMapScreen() {
  const {
    // estado
    markers,
    routePoints,
    selectedPlace,
    suggestions,
    query,
    isInfoCardVisible,
    userCoord, 
    setUserCoord,
    accuracyM,
    HARD_LOCK_CENTER,
    // acciones
    setQuery,
    buscarDestino,
    // buscarYRutaDesdeBackend,
    iniciarNavegacionConRuta,
    buscarAlternativasDesdeBackend,
    selectedRouteIndex,
    setSelectedRouteIndex,
    alternativeRoute,
    alternativeRoutetwo,
    onMarkerClick,
    filterSuggestions,
    mostrarBusqueda,
    onMapEvent,
    followUser,
    isNavigationActive,
    startNavigation, 
    stopNavigation,
    remainingMinutes, 
    distanciaLabel, 
    etaLabel,
    remainingMinutes2,
    distanciaLabel2,
    etaLabel2,
    remainingMinutes3,
    distanciaLabel3,
    rutasInfo,
    clearSearch,
    headingRadRef,
    estPosRef,
    offsetMeters,
    focusCoord,
  } = useCampusMap();

  const inputRef = useRef(null);
  const [openSugg, setOpenSugg] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const isLargeScreen = useMemo(() => window.innerWidth > 800, []);
  const { t } = useAppSettings();
  // ⟵⟵⟵ NUEVO: estado del Drawer
  const [openMenu, setOpenMenu] = useState(false);


  // Filtros
  const filters = [
    { label: t("cms_filterLibraries"), query: "biblioteca", category: "type" },
    { label: t("cms_filterCasinos"), query: "casino", category: "type" },
    { label: t("cms_filterKiosks"), query: "kiosko", category: "type" },
    { label: t("cms_filterBathrooms"), query: "baño", category: "type" },
    { label: t("cms_filterRooms"), query: "sala", category: "type" },
    { label: t("cms_filterSports"), query: "deporte", category: "type" },
    { label: t("cms_filterLabs"), query: "laboratorio", category: "type" },
    { label: t("cms_filterAuditoriums"), query: "auditorio", category: "type" },
    { label: t("cms_filterParking"), query: "estacionamiento", category: "type" },
    { label: t("cms_filterFountains"), query: "bebedero", category: "type" },
    { label: t("cms_filterFaculties"), query: "facultad", category: "facultad" },
    { label: t("cms_filterDepartments"), query: "departamento", category: "type" },

    { label: t("cms_filterSector1"), query: "1", category: "sector" },
    { label: t("cms_filterSector2"), query: "2", category: "sector" },
    { label: t("cms_filterSector3"), query: "3", category: "sector" },
    { label: t("cms_filterSector4"), query: "4", category: "sector" },
    { label: t("cms_filterSector5"), query: "5", category: "sector" },
    { label: t("cms_filterSector6"), query: "6", category: "sector" },
    { label: t("cms_filterSector7"), query: "7", category: "sector" },
    { label: t("cms_filterSector8"), query: "8", category: "sector" },
  ];
  const [showAllFilters, setShowAllFilters] = useState(false);
  const orderedFilters = useMemo(() => {
    if (!selectedFilter) return filters;
    // mover el filtro seleccionado al inicio
    const sel = filters.find((f) => f.query === selectedFilter);
    const rest = filters.filter((f) => f.query !== selectedFilter);
    return sel ? [sel, ...rest] : filters;
  }, [filters, selectedFilter]);

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta búsqueda por voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;   // 👈 permite resultados parciales
    recognition.continuous = true;      // se detiene cuando el usuario deja de hablar
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setQuery("🎤 Escuchando...");
    };

    recognition.onresult = (event) => {
      let texto = "";
      for (let i = 0; i < event.results.length; i++) {
        texto += event.results[i][0].transcript + " ";
      }
      setQuery(texto.trim());  
      // Cuando termina la frase (isFinal)
      if (event.results[event.results.length - 1].isFinal) {
        buscarDestino(texto.trim());  // dispara búsqueda final
        setOpenSugg(false);
      }
    };

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      alert("Error en búsqueda por voz: " + event.error);
    };

    recognition.onend = () => {
      console.log("🎤 Reconocimiento terminado");
    };

    recognition.start();
  };

  const lastPosRef = useRef(null);
  const mapRef = useRef();
  const [speedMps, setSpeedMps] = useState(0);

  const iconMap = {
    recto: ArrowUp,
    derecha: CornerDownRight,
    izquierda: CornerDownLeft,
    uturn: RefreshCw,
    llegada: MapPin,
  };

  useEffect(() => {
    if (!userCoord?.lat || !userCoord?.lng) return;
    const now = Date.now();
    if (lastPosRef.current) {
      const { lat, lng, t } = lastPosRef.current;
      const dt = (now - t) / 1000;
      if (dt > 0) {
        const R = 6378137;
        const toRad = (x) => (x * Math.PI) / 180;
        const dLat = toRad(userCoord.lat - lat);
        const dLng = toRad(userCoord.lng - lng);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat)) * Math.cos(toRad(userCoord.lat)) * Math.sin(dLng / 2) ** 2;
        const d = 2 * R * Math.asin(Math.sqrt(a));
        setSpeedMps(d / dt);
      }
    }
    lastPosRef.current = { lat: userCoord.lat, lng: userCoord.lng, t: now };
  }, [userCoord]);


  return (
    <div className="h-screen w-screen">
      <DrawerMenu
        isOpen={openMenu}
        onClose={() => setOpenMenu(false)}
        t={(k) => ({
          ms_menuTitle: "Menú",
          ms_login: "Iniciar sesión",
          ms_portalUsach: "Portal USACH",
          ms_portalFahu: "Portal FAHU",
          ms_portalAlumnos: "Portal Alumnos",
          ms_onlineServices: "Servicios en línea",
          ms_onlineLibrary: "Biblioteca en línea",
          ms_settings: "Configuración",
        }[k] || k)}
      />

      {/* Layout tipo Flutter: panel a la izquierda en pantallas grandes */}
      <div className="h-full w-full flex">
        {isLargeScreen && isInfoCardVisible && (selectedPlace || routePoints.length > 0) && (
          <div className="w-[340px] p-3">
            <PlaceInfoCard
              place={selectedPlace}
              routeAvailable={!!selectedPlace}
              isNavigationActive={isNavigationActive}
              /* buscarYRutaDesdeBackend={buscarYRutaDesdeBackend} */
              buscarAlternativasDesdeBackend={buscarAlternativasDesdeBackend}
              onStartWithRoute={iniciarNavegacionConRuta}  
              onStart={startNavigation}
              onStop={stopNavigation}
              onClear={() => { clearSearch(); setSelectedFilter(null); setOpenSugg(false); }}
              remainingMinutes={remainingMinutes}
              distanciaLabel={distanciaLabel}
              etaLabel={etaLabel}
              rutasInfo={rutasInfo}
              selectedRouteIndex={selectedRouteIndex}

            />
            {rutasInfo[selectedRouteIndex]?.instrucciones?.length > 0 && (
                  <div className="p-2 bg-white/90 rounded-lg shadow-md max-h-60 overflow-y-auto">
                    <h3 className="font-semibold mb-2">Instrucciones</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {rutasInfo[selectedRouteIndex]?.instrucciones?.map((step, i) => {
                        const Icon = iconMap[step.tipo] || ArrowUp;
                        return (
                          <li key={i} className="flex items-center gap-2">
                            <Icon size={18} className="text-blue-600" />
                            <span>{step.texto}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
          </div>
        )}
        <div className="flex-1 relative">
          {/* === OVERLAY MÓVIL (bottom) ==================================== */}
            {!isLargeScreen && isInfoCardVisible && (selectedPlace || routePoints.length > 0) && (
              <div className="absolute bottom-0 left-0 right-0 p-3 z-[1000]">
                <PlaceInfoCard
                  place={selectedPlace}
                  routeAvailable={!!selectedPlace}
                  isNavigationActive={isNavigationActive}
                  // buscarYRutaDesdeBackend={buscarYRutaDesdeBackend}
                  buscarAlternativasDesdeBackend={buscarAlternativasDesdeBackend}
                  onStartWithRoute={iniciarNavegacionConRuta}  
                  onStart={startNavigation}
                  onStop={stopNavigation}
                  onClear={() => { clearSearch(); setSelectedFilter(null); setOpenSugg(false); }}
                  remainingMinutes={remainingMinutes}
                  distanciaLabel={distanciaLabel}
                  etaLabel={etaLabel}
                  rutasInfo={rutasInfo}
                  selectedRouteIndex={selectedRouteIndex}
                />
                {isNavigationActive &&
                  rutasInfo[selectedRouteIndex]?.instrucciones?.length > 0 && (
                    <div className="p-2 bg-white/90 rounded-lg shadow-md max-h-60 overflow-y-auto">
                      <h3 className="font-semibold mb-2">Instrucciones</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {rutasInfo[selectedRouteIndex]?.instrucciones?.map((step, i) => {
                          const Icon = iconMap[step.tipo] || ArrowUp;
                          return (
                            <li key={i} className="flex items-center gap-2">
                              <Icon size={18} className="text-blue-600" />
                              <span>{step.texto}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                )}
              </div>
            )}
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            minZoom={1}
            maxZoom={19}
            zoomControl={false}
            className="h-full w-full z-0"
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={19}
              maxZoom={22}
              attribution='&copy; OpenStreetMap contributors'
            />

            <MapEventBridge onMapEvent={onMapEvent} />

            {routePoints.length > 0 && (
              <>
                {alternativeRoute.length > 0 && (
                  <Polyline key={`alt1-${selectedRouteIndex}`} positions={alternativeRoute} color="orange"  weight={selectedRouteIndex === 1 ? 6 : 4} opacity={selectedRouteIndex === 1 ? 1.0 : 0.6} dashArray={selectedRouteIndex === 1 ? null : "10, 10"} eventHandlers={{click: () => setSelectedRouteIndex(1),}}/>
                )}
                {alternativeRoutetwo.length > 0 && (
                  <Polyline key={`alt2-${selectedRouteIndex}`} positions={alternativeRoutetwo} color="red"  weight={selectedRouteIndex === 2 ? 6 : 4} opacity={selectedRouteIndex === 2 ? 1.0 : 0.5} dashArray={selectedRouteIndex === 2 ? null : "10, 10"} eventHandlers={{click: () => setSelectedRouteIndex(2),}}/>
                )}
                {/* Ruta principal  */}
                <Polyline key={`main-${selectedRouteIndex}`} positions={routePoints} color="blue" weight={selectedRouteIndex === 0 ? 6 : 4} opacity={selectedRouteIndex === 0 ? 1.0 : 0.5} dashArray={selectedRouteIndex === 0 ? null : "10, 10"} eventHandlers={{click: () => setSelectedRouteIndex(0),}}/>

                <FitRoute points={[...routePoints, ...alternativeRoute, ...alternativeRoutetwo].filter((p) => Array.isArray(p) && p.length === 2)} />
                {routePoints.length > 1 &&(
                  <Marker
                    position={routePoints[Math.floor(routePoints.length * 2 / 3)]} // punto medio
                    icon={L.divIcon({
                      className: "eta-box",
                      html: `
                        <div  class="eta-card min-w-[80px] max-w-[100px] bg-blue-400/60 backdrop-blur border border-gray-300 rounded-lg p-1 text-center shadow-lg">
                          <strong>${remainingMinutes} min</strong><br>
                          <span>${distanciaLabel}</span><br>
                        </div>
                      `,
                      
                    },)}
                    interactive={false}
                  />
                )}
                {alternativeRoute.length > 1 && (
                  <Marker
                    position={alternativeRoute[Math.floor(alternativeRoute.length / 2)]} // punto medio
                    icon={L.divIcon({
                      className: "eta-box",
                      html: `
                        <div  class="eta-card min-w-[80px] max-w-[100px] bg-orange-500/60 backdrop-blur border border-gray-300 rounded-lg p-1 text-center shadow-lg">
                          <strong>${remainingMinutes2} min</strong><br>
                          <span>${distanciaLabel2}</span><br>
                        </div>
                      `,
                      
                    },)}
                    interactive={false}
                  />
                )}
                {alternativeRoutetwo.length > 1 && (
                  <Marker
                    position={alternativeRoutetwo[Math.floor(alternativeRoutetwo.length / 2)]} // punto medio
                    icon={L.divIcon({
                      className: "eta-box",
                      html: `
                        <div  class="eta-card min-w-[80px] max-w-[100px] bg-red-500/60 backdrop-blur border border-gray-300 rounded-lg p-1 text-center shadow-lg">
                          <strong>${remainingMinutes3} min</strong><br>
                          <span>${distanciaLabel3}</span><br>
                        </div>
                      `,
                      
                    },)}
                    interactive={false}
                  />
                )}
              </>
            )}
            <HeadingLocationMarkerLion             
            coord={userCoord}
            headingRad={headingRadRef.current || 0}
            accuracyM={accuracyM}
            walking={isNavigationActive || speedMps > 0.2}
            speedMps={speedMps}
            />

            <FlyToPoint coord={focusCoord} />

            {markers
              .filter((m) => m.type?.toLowerCase() !== "camino")
              .map((m) => {
                let icon = nodeIcons.default;

                if (m.type?.toLowerCase() === "deporte") {
                  const nombre = m.name?.toLowerCase().replace(/\s*usach\s*/g, "").trim();
                  icon = nodeIcons.deporte[nombre] || nodeIcons.default;
                } else if(m.type?.toLowerCase() === "estructuras"){
                  const nombre = m.name?.toLowerCase().trim();
                  icon = nodeIcons.estructuras[nombre] || nodeIcons.estructuras["default"] || nodeIcons.default;
                } else {
                  icon = nodeIcons[m.type?.toLowerCase()] || nodeIcons.default;
                }

                return (
                  <Marker
                    key={m.id}
                    position={[m.lat, m.lng]}
                    icon={icon}
                    eventHandlers={{
                      click: () => onMarkerClick(m), // 👈 abre la PlaceInfoCard
                    }}
                  >
                  </Marker>
                );
            })}

            {/* NUEVO: barra de controles unificada */}
            <ControlBar setUserCoord={setUserCoord} />

            <CameraFollow
              followUser={followUser}                 
              isNavigationActive={isNavigationActive}
              HARD_LOCK_CENTER={HARD_LOCK_CENTER}
              userCoord={userCoord}
              estPosRef={estPosRef}
              headingRadRef={headingRadRef}
              offsetMeters={offsetMeters}
            />
          </MapContainer>

          {/* Controles superiores (Busqueda + Filtros) */}
          <div className="absolute top-10 left-4 right-4 z-[1000] pointer-events-auto">
            
            {/* En móviles: columna; en desktop: fila */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {/* WRAPPER RELATIVE para anclar el dropdown */}
              <div className="relative w-full md:w-auto">
                {/* Barra de búsqueda: máx 380x50 */}
                <div className="bg-white rounded-2xl shadow border px-3 flex items-center gap-2
                                w-full md:w-auto max-w-[380px] h-[50px]">
                  <span className="text-blue-600">📍</span>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (query?.trim()) {
                        buscarDestino(query.trim()); 
                        inputRef.current?.blur();
                      }
                      setOpenSugg(false);
                    }}
                    className="flex-1 h-full"
                  >
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setOpenSugg(true);
                      }}
                      onFocus={() => setOpenSugg(true)}
                      onBlur={() => setTimeout(() => setOpenSugg(false), 120)} // deja hacer click
                      placeholder={t("cms_searchHint")}
                      className="w-full h-full outline-none bg-transparent"
                    />
                  </form>

                  {/* botones a la derecha */}
                  <button
                    type="button"
                    className="px-2 py-1 rounded-lg hover:bg-gray-100"
                    title="Búsqueda por voz"
                    onClick={startVoiceSearch}   
                  >
                    🎤
                  </button>

                  <button
                    type="button"
                    className="px-2 py-1 rounded-lg hover:bg-gray-100"
                    title="Abrir menú"
                    onClick={() => setOpenMenu(true)}
                  >
                    ☰
                  </button>
                </div>

                {/* DROPDOWN: usa filtro cuando hay texto, sino primeras 12 */}
                {openSugg && (
                  (() => {
                    const visible =
                      (query?.trim()
                        ? filterSuggestions(query, 12)
                        : suggestions.slice(0, 12)) || [];
                    return visible.length > 0 ? (
                      <div className="absolute z-[1200] mt-2 w-full max-w-[380px] bg-white border rounded-xl shadow max-h-72 overflow-auto">
                        {visible.map((s, idx) => {
                          const name = s.name || s; // soporta string u objeto
                          const type = s.type;
                          return (
                            <button
                              key={(s.id ?? name) + "-" + idx}
                              // mousedown para evitar que el blur cierre antes
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setQuery(name);
                                buscarDestino(name);
                                setOpenSugg(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50"
                            >
                              <div className="font-medium">{name}</div>
                              {type && <div className="text-xs text-gray-500">{type}</div>}
                            </button>
                          );
                        })}
                      </div>
                    ) : null;
                  })()
                )}
              </div>

              {/* Filtros */}
              <div className="w-full md:flex-1">
                <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible">
                  {(showAllFilters ? orderedFilters : orderedFilters.slice(0, 4)).map((f) => {
                    const active = selectedFilter === f.query;
                    return (
                      <button
                        key={f.query}
                        onClick={() => {
                          const next = active ? null : f.query;
                          setSelectedFilter(next);

                          if (next) {
                            setQuery(next);
                            mostrarBusqueda(next, f.category);
                          } else {
                            setQuery("");
                            mostrarBusqueda("");
                          }
                          setShowAllFilters(false); // cerrar lista al seleccionar
                        }}
                        className={
                          "px-3 py-1 rounded-2xl border text-sm " +
                          (active
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-800 border-gray-300")
                        }
                      >
                        {f.label}
                      </button>
                    );
                  })}

                  {/* Botón extra: ... o – */}
                  <button
                    onClick={() => setShowAllFilters((v) => !v)}
                    className="px-3 py-1 rounded-2xl border text-sm bg-white text-gray-800 border-gray-300"
                  >
                    {showAllFilters ? "–" : "..."}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionChip({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  variant = "primary", // "primary" | "muted" | "accent" | "danger"
}) {
  const styles = {
    primary:
      "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 dark:bg-cyan-500 dark:hover:bg-cyan-600",
    muted:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
    accent:
      "bg-blue-100 text-blue-900 hover:bg-blue-200 active:bg-blue-300 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 dark:bg-rose-500 dark:hover:bg-rose-600",
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "group inline-flex items-center gap-2 rounded-2xl px-4 h-11",
        "font-semibold text-sm tracking-tight",
        "shadow-sm hover:shadow transition-all",
        "ring-1 ring-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        styles,
      ].join(" ")}
    >
      <Icon size={18} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function PlaceInfoCard({
  place,
  routeAvailable,
  // buscarYRutaDesdeBackend,
  buscarAlternativasDesdeBackend,
  isNavigationActive,
  selectedRouteIndex,
  onStart,
  onStartWithRoute,
  onStop,
  onClear,
  remainingMinutes,
  distanciaLabel,
  etaLabel,
  rutasInfo,
}) {
  const { t } = useAppSettings();

  if (!place && !routeAvailable) return null;

  const defaultImage = "/icons/nube.png"; 
  // const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // const photoRef = "AciIO2fOx_TYlvHKJQn14N1TTZ3VIjxjdIYmUJYiCrdHhI_g-BDswUATrYC8VFnrGVxEZIoLqIBTdQaw_mm6Pa4pFB7Nw_iVeuYgmLvfE7APiL4PEl_ZjMvxK5NnGROSaB4vOTbeLGKAy54IQHzj9YOSXtNoq8aL-mggObciwhmTOPhlI70uHaorkjZ2L9IPQuVJ6RLSVzaOn6w15hgO3LgO4lzZBxiG-e5jTThBhUKXlpvBZxdJbbp7XPIMruPc7PK7Jca1yf40Pd8kToh0N0PYfDEzOHFw9qiHp8A3oeVYvhBcyUYUr7umKJhf-ndVtl45dRaZPlgJO_iVhf_v8zr-ZHWrMMPGfX-JCfwGoCPJKikNNORFTwaI0hHj5FshEfSzANAL1OgNIXBW6o074VkM2qowA7FnJ8fy4Qx7rZY9YzLmFWqd";
  const imageUrl = defaultImage;
  // const imageUrl = photoRef
  //   ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${apiKey}`
  //   : defaultImage;


  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow p-4 w-full max-w-[340px] border">
      {/* Banner de imagen */}
      <div className="relative h-40 w-full">
        <img
          src={imageUrl}
          alt={place?.name || "Lugar"}
          className="object-cover w-full h-full rounded-t-2xl bg-gray-100"
          onError={(e) => {
            e.currentTarget.onerror = null; // evita bucle infinito
            e.currentTarget.src = defaultImage;
            e.currentTarget.classList.add("object-contain"); // cambia a 'contain' si es fallback
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {place?.name && (
          <div className="absolute bottom-2 left-3 text-white text-lg font-semibold drop-shadow">
            {place.name}
          </div>
        )}
      </div>

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-lg">{place?.name || "Destino"}</div>
          {place?.type && <div className="text-xs text-gray-500">{place.type}</div>}
        </div>

        {/* Botón borrar */}
        <button
          onClick={onClear}
          className="text-sm rounded-lg border px-3 py-1.5 bg-white hover:bg-gray-50"
          title="Borrar búsqueda"
        >
        {t("cms_btn_close")}
        </button>
      </div>

      {/* info */}
      {place?.description && (
        <p className="mt-2 text-sm text-gray-700">{place.description}</p>
      )}
      {(place?.sector || place?.floor) && (
        <div className="mt-2 text-sm">
          {place?.sector && (
            <span className="inline-block mr-2 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs border border-blue-200">
              Sector: {place.sector}
            </span>
          )}
          {place?.floor && (
            <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs border border-emerald-200">
              Piso: {place.floor}
            </span>
          )}
        </div>
      )}
      {/* info de distancia y tiempo */}
      {(distanciaLabel || remainingMinutes || etaLabel) && (
        <div className="mt-3 flex flex-col text-sm text-gray-700">
          {distanciaLabel && (
            <div>
              <span className="font-medium">Distancia:</span> {distanciaLabel}
            </div>
          )}
          {remainingMinutes && (
            <div>
              <span className="font-medium">Duración:</span> {remainingMinutes} min
            </div>
          )}
          {etaLabel && (
            <div>
              <span className="font-medium">Llegada estimada:</span> {etaLabel}
            </div>
          )}
        </div>
      )}
      {/* navegación */}
      {isNavigationActive ? (
        <div className="mt-4">
          <div className="text-3xl font-extrabold leading-none">
            {remainingMinutes} min
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {distanciaLabel} · {etaLabel}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onStop}
              className="rounded-xl px-4 py-2 bg-red-600 text-white font-semibold hover:bg-red-700"
            >
              {t("cms_btn_exit")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Cómo llegar */}
          <ActionChip
            icon={Route}
            label="Cómo llegar"
            variant="primary"
            onClick={() => buscarAlternativasDesdeBackend(place?.name)}
          />

          {/* Iniciar / Detener */}
          <ActionChip
            icon={isNavigationActive ? Square : Play}
            label={isNavigationActive ? "Detener" : "Iniciar"}
            variant={isNavigationActive ? "danger" : "muted"}
            disabled={!routeAvailable}
            onClick={() => {
              if (isNavigationActive) {
                onStop?.();
              } else {
                const rutaSeleccionada = rutasInfo?.[selectedRouteIndex];
                if (!rutaSeleccionada) return;
                onStartWithRoute?.(rutaSeleccionada, { index: selectedRouteIndex, dest: place });
                onStart?.();
              }
            }}
          />

          {/* Guardar */}
          <ActionChip
            icon={Bookmark}
            label="Guardar"
            variant="accent"
            onClick={() => {
              if (!place) return alert("No hay destino seleccionado");
              const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
              if (!favoritos.some((f) => f.id === place.id)) {
                favoritos.push(place);
                localStorage.setItem("favoritos", JSON.stringify(favoritos));
                // toast/alert discreto
              } else {
                // ya existe
              }
            }}
          />

          {/* Compartir */}
          <ActionChip
            icon={Share2}
            label="Compartir"
            variant="muted"
            onClick={async () => {
              if (!place) return alert("No hay destino seleccionado");
              const url = `${window.location.origin}?lat=${place.lat}&lng=${place.lng}`;
              const shareData = { title: `Destino: ${place.name}`, text: place.name, url };
              if (navigator.share) {
                try { await navigator.share(shareData); } catch {}
              } else {
                await navigator.clipboard.writeText(url);
                // toast/alert discreto
              }
            }}
          />
        </div>
      )}
    </div>

  );
}

