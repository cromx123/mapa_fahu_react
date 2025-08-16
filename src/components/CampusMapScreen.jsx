import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useCampusMap from "../hooks/useCampusMapController";
import CameraFollow from "./CameraFollow";
import HeadingLocationMarkerLion from "./HeadingLocationMarker";

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

/* NUEVO: barra de controles (- ⦿ +) abajo-derecha */
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
        onClick={locate}
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
    buscarYRutaDesdeBackend,
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
  } = useCampusMap();

  const inputRef = useRef(null);
  const [openSugg, setOpenSugg] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const isLargeScreen = useMemo(() => window.innerWidth > 800, []);

  // Filtros rápidos como en Flutter
  const filters = [
    { label: "Bibliotecas", query: "biblioteca" },
    { label: "Casinos", query: "casino" },
    { label: "Baños", query: "baño" },
    { label: "Salas", query: "sala" },
    { label: "Otros", query: "otros" },
  ];

  const lastPosRef = useRef(null);
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
      {/* Layout tipo Flutter: panel a la izquierda en pantallas grandes */}
      <div className="h-full w-full flex">
        {isLargeScreen && isInfoCardVisible && (selectedPlace || routePoints.length > 0) && (
          <div className="w-[340px] p-3">
            <PlaceInfoCard
              place={selectedPlace}
              routeAvailable={routePoints.length > 0}
              isNavigationActive={isNavigationActive}
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
                  routeAvailable={routePoints.length > 0}
                  isNavigationActive={isNavigationActive}
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
            maxZoom={25}
            zoomControl={false}
            className="h-full w-full z-0"
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={19}
              attribution='&copy; OpenStreetMap contributors'
            />

            <MapEventBridge onMapEvent={onMapEvent} />

            {routePoints.length > 0 && (
              <>
                <Polyline positions={routePoints} weight={4} />
                <FitRoute points={routePoints} />
              </>
            )}

            <HeadingLocationMarkerLion             
            coord={userCoord}
            headingRad={headingRadRef.current || 0}
            accuracyM={accuracyM}
            walking={isNavigationActive || speedMps > 0.2}
            speedMps={speedMps}
            />


            {markers.map((m) => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                eventHandlers={{ click: () => onMarkerClick(m) }}
              >
                <Popup>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-gray-600">{m.type}</div>
                </Popup>
              </Marker>
            ))}

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
                      if (query?.trim()) buscarYRutaDesdeBackend(query.trim());
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
                      placeholder="Buscar sala/edificio…"
                      className="w-full h-full outline-none bg-transparent"
                    />
                  </form>

                  {/* botones a la derecha */}
                  <button
                    type="button"
                    className="px-2 py-1 rounded-lg hover:bg-gray-100"
                    title="Búsqueda por voz"
                    onClick={() => alert("Mic placeholder.")}
                  >
                    🎤
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded-lg hover:bg-gray-100"
                    title="Abrir menú"
                    onClick={() => alert("Abrir menú (placeholder)")}
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
                                buscarYRutaDesdeBackend(name);
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

              {/* Filtros*/}
              <div className="w-full md:flex-1">
                <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible">
                  {filters.map((f) => {
                    const active = selectedFilter === f.query;
                    return (
                      <button
                        key={f.query}
                        onClick={() => {
                          const next = active ? null : f.query;
                          setSelectedFilter(next);
                          const text = next || "";
                          setQuery(text);
                          mostrarBusqueda(text);
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
  isNavigationActive,
  onStart,
  onStop,
  onClear,
  remainingMinutes,
  distanciaLabel,
  etaLabel,
}) {
  if (!place && !routeAvailable) return null;

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow p-4 w-full max-w-[340px] border">
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
          Cerrar
        </button>
      </div>

      {/* info */}
      {place?.description && (
        <p className="mt-2 text-sm text-gray-700">{place.description}</p>
      )}
      {place?.lat != null && place?.lng != null && (
        <div className="mt-2 text-xs text-gray-500">
          Lat: {place.lat?.toFixed?.(6)} · Lng: {place.lng?.toFixed?.(6)}
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
              Salir
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onStart}
            disabled={!routeAvailable}
            className={
              "rounded-xl px-4 py-2 font-semibold " +
              (routeAvailable
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed")
            }
            title="Iniciar ruta"
          >
            Iniciar
          </button>
        </div>
      )}
    </div>
  );
}

