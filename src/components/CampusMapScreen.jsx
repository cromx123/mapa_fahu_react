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
    buscarYRutaDesdeBackend,
    buscarAlternativasDesdeBackend,
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
              buscarYRutaDesdeBackend={buscarYRutaDesdeBackend}
              buscarAlternativasDesdeBackend={buscarAlternativasDesdeBackend}
              onStart={startNavigation}
              onStop={stopNavigation}
              onClear={() => { clearSearch(); setSelectedFilter(null); setOpenSugg(false); }}
              remainingMinutes={remainingMinutes}
              distanciaLabel={distanciaLabel}
              etaLabel={etaLabel}
            />

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
                  buscarYRutaDesdeBackend={buscarYRutaDesdeBackend}
                  buscarAlternativasDesdeBackend={buscarAlternativasDesdeBackend}
                  onStart={startNavigation}
                  onStop={stopNavigation}
                  onClear={() => { clearSearch(); setSelectedFilter(null); setOpenSugg(false); }}
                  remainingMinutes={remainingMinutes}
                  distanciaLabel={distanciaLabel}
                  etaLabel={etaLabel}
                />
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
                {/* Ruta principal (azul) */}
                <Polyline positions={routePoints} color="blue" weight={5} />

                {/* Ruta alternativa (naranjo, punteada) */}
                {alternativeRoute.length > 0 && (
                  <Polyline
                    positions={alternativeRoute}
                    color="orange"
                    weight={4}
                    dashArray="10, 10"
                    opacity={0.7}
                  />
                )}
                {alternativeRoutetwo.length > 0 && (
                  <Polyline
                    positions={alternativeRoutetwo}
                    color="red"
                    weight={4}
                    dashArray="10, 10"
                    opacity={0.6}
                  />
                )}

                {/* Ajusta el mapa para mostrar ambas rutas */}
                <FitRoute
                  points={[...routePoints, ...alternativeRoute, ...alternativeRoutetwo].filter(Boolean)}
                />
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

function PlaceInfoCard({
  place,
  routeAvailable,
  buscarYRutaDesdeBackend,
  buscarAlternativasDesdeBackend,
  isNavigationActive,
  onStart,
  onStop,
  onClear,
  remainingMinutes,
  distanciaLabel,
  etaLabel,
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
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (place) {
                buscarYRutaDesdeBackend(place.name); // ← recién aquí traza ruta
              }
            }}
            disabled={!routeAvailable}
            className={
              "rounded-xl px-4 py-2 font-semibold " +
              (routeAvailable
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed")
            }
            title="Iniciar ruta"
          >
            {t("cms_btn_start")}
          </button>
          {/* Botón ¿Cómo llegar? */}
          <button
            onClick={() => buscarAlternativasDesdeBackend(place.name)}
            className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
          >
            ¿Cómo llegar?
          </button>
        </div>
      )}
    </div>
  );
}

