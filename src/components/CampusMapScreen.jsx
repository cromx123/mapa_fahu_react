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
      {/* Si quieres el círculo de precisión, descomenta:
      <Circle center={[coord.lat, coord.lng]} radius={coord.accuracy || 20} />
      */}
    </>
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
    // acciones
    setQuery,
    buscarYRutaDesdeBackend,
    onMarkerClick,
    filterSuggestions,
    mostrarBusqueda,
    onMapEvent,
  } = useCampusMap();

  const inputRef = useRef(null);
  const [openSugg, setOpenSugg] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [userCoord, setUserCoord] = useState(null);
  const isLargeScreen = useMemo(
    () => window.innerWidth > 800,
    []
  );

  // Geolocalización simple (equivalente a moveToUserLocation + marker)
  function moveToUserLocation(map) {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserCoord({ lat: latitude, lng: longitude, accuracy });
        map.flyTo([latitude, longitude], 18, { duration: 0.6 });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  // Filtros rápidos como en Flutter
  const filters = [
    { label: "Bibliotecas", query: "biblioteca" },
    { label: "Casinos", query: "casino" },
    { label: "Baños", query: "baño" },
    { label: "Salas", query: "sala" },
    { label: "Otros", query: "otros" },
  ];

  // Componente auxiliar para botón flotante que necesita el map
  function LocateButton() {
    const map = useMap();
    return (
      <button
        onClick={() => moveToUserLocation(map)}
        className="rounded-full border p-3 shadow bg-white hover:bg-gray-50"
        title="Mi ubicación"
      >
        ⦿
      </button>
    );
  }

  return (
    <div className="h-screen w-screen">
      {/* Layout tipo Flutter: panel a la izquierda en pantallas grandes */}
      <div className="h-full w-full flex">
        {isLargeScreen && routePoints.length > 0 && (
          <div className="w-[340px] p-3">
            <PlaceInfoCard place={selectedPlace} />
          </div>
        )}

        <div className="flex-1 relative">
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            minZoom={1}
            maxZoom={25}
            className="h-full w-full"
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

            <MyLocationMarker coord={userCoord} />

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

            {/* Botón flotante (esquina inferior derecha) */}
            <div className="leaflet-top leaflet-right mr-3 mb-3" style={{ bottom: 20, position: "absolute", right: 20 }}>
              <LocateButton />
            </div>
          </MapContainer>

          {/* Controles superiores (buscador + chips) */}
          <div className="absolute top-10 left-4 right-4">
            <div className="bg-white rounded-2xl shadow border px-3 py-2 flex items-center gap-2">
              <span className="text-blue-600">📍</span>
              <div className="relative w-full">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (query?.trim()) buscarYRutaDesdeBackend(query.trim());
                    setOpenSugg(false);
                  }}
                >
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setOpenSugg(true);
                    }}
                    onFocus={() => setOpenSugg(true)}
                    placeholder="Buscar sala/edificio…"
                    className="w-full outline-none bg-transparent py-1"
                  />
                </form>

                {openSugg && suggestions.length > 0 && (
                  <div className="absolute z-[1000] mt-2 w-full bg-white border rounded-xl shadow max-h-72 overflow-auto">
                    {suggestions.slice(0, 12).map((s) => (
                      <button
                        key={s.id || s.name}
                        onClick={() => {
                          setQuery(s.name || s);
                          buscarYRutaDesdeBackend(s.name || s);
                          setOpenSugg(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      >
                        <div className="font-medium">{s.name || s}</div>
                        {s.type && (
                          <div className="text-xs text-gray-500">{s.type}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón “mic” (placeholder simple) */}
              <button
                type="button"
                className="px-2 py-1 rounded-lg hover:bg-gray-100"
                title="Búsqueda por voz"
                onClick={() => {
                  // Puedes integrar Web Speech API aquí
                  alert("Mic placeholder. Integra Web Speech API si quieres.");
                }}
              >
                🎤
              </button>

              {/* Botón menú (placeholder modal/panel) */}
              <button
                type="button"
                className="px-2 py-1 rounded-lg hover:bg-gray-100"
                title="Abrir menú"
                onClick={() => alert("Abrir menú (placeholder)")}
              >
                ☰
              </button>
            </div>

            <div className="mt-2 pl-1">
              <div className="flex gap-2 overflow-x-auto">
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
                        "px-3 py-1 rounded-full border text-sm shrink-0 " +
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

          {/* InfoCard móvil (abajo) */}
          {!isLargeScreen && routePoints.length > 0 && isInfoCardVisible && (
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <PlaceInfoCard place={selectedPlace} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceInfoCard({ place }) {
  if (!place) return null;
  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow p-4 w-full md:w-96 border">
      <div className="font-semibold text-lg mb-1">{place.name}</div>
      <div className="text-xs text-gray-500 mb-2">{place.type}</div>
      <p className="text-sm text-gray-700">{place.description || "Sin descripción."}</p>
      <div className="mt-2 text-xs text-gray-500">
        Lat: {place.lat?.toFixed?.(6)} · Lng: {place.lng?.toFixed?.(6)}
      </div>
    </div>
  );
}
