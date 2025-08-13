// src/hooks/useCampusMapController.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL; // <- tu backend

export default function useCampusMapController() {
  // ---- State principal ----
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // strings
  const [markers, setMarkers] = useState([]); // [{id, name, type, lat, lng}]
  const [routePoints, setRoutePoints] = useState([]); // [[lat, lng], ...]
  const [selectedPlace, setSelectedPlace] = useState(null); // {id,name,type,lat,lng,...}
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(false);

  // Navegación / seguimiento
  const [isNavigationActive, setIsNavigationActive] = useState(false);
  const [followUser, setFollowUser] = useState(false);

  // Posición y heading “fusionados”
  const userPosRef = useRef(null);         // {lat, lng, accuracy}
  const estPosRef  = useRef(null);         // posición “suavizada”
  const lastAccRef = useRef(20);           // accuracy último GPS
  const headingRadRef = useRef(0);         // rumbo (rad)
  const lastGyroTsRef = useRef(null);      // timestamp p/ integración simple
  const lastRerouteTsRef = useRef(0);      // cooldown p/ re-ruta
  const rerouteCooldownMs = 6000;
  const deviationThresholdM = 0.5; // como en Flutter

  // Distancias/tiempos
  const [distanciaM, setDistanciaM] = useState(0);
  const [tiempoMin, setTiempoMin] = useState(0);
  const [etaDate, setEtaDate]     = useState(null);

  // ---- Utilidades geométricas ----
  const toMetersX = (lon, latRef) => lon * 111320.0 * Math.cos((latRef * Math.PI) / 180.0);
  const toMetersY = (lat) => lat * 110540.0;

  const distancePointToPolylineMeters = (p, line) => {
    if (!line || line.length < 2) return Number.POSITIVE_INFINITY;
    const [plat, plng] = p;
    const latRef = plat;
    const px = toMetersX(plng, latRef);
    const py = toMetersY(plat);
    let best = Number.POSITIVE_INFINITY;

    for (let i = 0; i < line.length - 1; i++) {
      const [alat, alng] = line[i];
      const [blat, blng] = line[i + 1];
      const x1 = toMetersX(alng, latRef);
      const y1 = toMetersY(alat);
      const x2 = toMetersX(blng, latRef);
      const y2 = toMetersY(blat);

      const dx = x2 - x1, dy = y2 - y1;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) {
        const d = Math.hypot(px - x1, py - y1);
        if (d < best) best = d;
        continue;
      }
      let t = ((px - x1) * dx + (py - y1) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const projX = x1 + t * dx, projY = y1 + t * dy;
      const d = Math.hypot(px - projX, py - projY);
      if (d < best) best = d;
    }
    return best;
  };

  const offsetMeters = (p, dx, dy) => {
    // dx,dy en metros sobre lat/lng
    const [lat, lng] = p;
    const R = 6378137.0;
    const dLat = dy / R;
    const dLng = dx / (R * Math.cos((lat * Math.PI) / 180.0));
    return [
      lat + (dLat * 180.0) / Math.PI,
      lng + (dLng * 180.0) / Math.PI,
    ];
  };

  const normalizeAngle = (a) => {
    let x = a;
    while (x > Math.PI) x -= 2 * Math.PI;
    while (x < -Math.PI) x += 2 * Math.PI;
    return x;
  };

  const weightFromAccuracy = (acc) => {
    const a = Math.max(5.0, Math.min(50.0, acc));
    const t = (a - 5.0) / (50.0 - 5.0);
    return 0.9 * (1 - t) + 0.2 * t;
  };

  // ---- Sugerencias desde backend (una vez) ----
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`${BASE_URL}/sugerencias`, { headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (!Array.isArray(j)) throw new Error("Se esperaba una lista JSON");
        // strings únicas
        const seen = new Set();
        const list = j.map(String).filter((s) => {
          const ok = !seen.has(s);
          if (ok) seen.add(s);
          return ok;
        });
        if (mounted) setSuggestions(list);
      } catch {
        if (mounted) setSuggestions([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ---- Autocomplete local (como filterSuggestions) ----
  const filterSuggestions = useCallback((text, limit = 12) => {
    const norm = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
    const q = norm(text || "");
    if (!q) return [];
    const starts = [];
    const contains = [];
    for (const s of suggestions) {
      const n = norm(s);
      if (n.includes(q)) {
        if (n.startsWith(q) || n.split(" ").some((w) => w.startsWith(q))) {
          starts.push(s);
        } else {
          contains.push(s);
        }
      }
      if (starts.length + contains.length >= limit) break;
    }
    return [...starts, ...contains].slice(0, limit);
  }, [suggestions]);

  // ---- Buscar y trazar ruta desde backend ----
  const buscarYRutaDesdeBackend = useCallback(async (texto) => {
    try {
      const q = (texto ?? "").trim();
      if (!q) return;

      // 1) /destinos?query=...
      const r1 = await fetch(`${BASE_URL}/destinos?query=${encodeURIComponent(q)}`);
      if (!r1.ok) return;
      const j1 = await r1.json();
      const item = j1?.items?.[0];
      if (!item) return;

      const dest = {
        id: item.id,
        name: item.nombre || "",
        type: item.tipo || "",
        sector: item.sector || "",
        floor: item.nivel || "",
        lat: item.lat,
        lng: item.lng,
      };

      // 2) obtener posición actual (o última conocida)
      const pos = await getUserPosition();
      if (!pos) return;
      userPosRef.current = pos;
      if (!estPosRef.current) estPosRef.current = [pos.lat, pos.lng];

      // 3) /ruta_desde_ubicacion?lat=..&lng=..&destino=id
      const r2 = await fetch(`${BASE_URL}/ruta_desde_ubicacion?lat=${pos.lat}&lng=${pos.lng}&destino=${encodeURIComponent(dest.id)}`);
      if (!r2.ok) {
        setRoutePoints([]);
        return;
      }
      const j2 = await r2.json();
      const ruta = (j2.ruta || []).map((p) => [p.lat, p.lng]);
      setRoutePoints(ruta);
      setSelectedPlace(dest);
      setIsInfoCardVisible(true);
      setMarkers(() => {
        const arr = [];
        if (ruta.length > 0) {
          const [dlat, dlng] = ruta[ruta.length - 1];
          arr.push({ id: dest.id, name: dest.name, type: dest.type, lat: dlat, lng: dlng });
        }
        return arr;
      });

      // Distancia/ETA (5 km/h)
      const dist = Number(j2.distancia_total_metros ?? j2.distancia_m ?? 0);
      const km = dist / 1000;
      const velocidadKmH = 5.0;
      const horas = km / velocidadKmH;
      const minutos = horas * 60.0;
      setDistanciaM(dist);
      setTiempoMin(minutos);
      setEtaDate(new Date(Date.now() + Math.round(minutos) * 60 * 1000));
      setFollowUser(true);
      setIsNavigationActive(true);
    } catch (e) {
      // silencioso
    }
  }, []);

  // ---- Mostrar búsqueda: solo marcadores desde backend ----
  const mostrar_busqueda = useCallback(async (texto) => {
    try {
      const q = (texto ?? "").trim();
      const r = await fetch(`${BASE_URL}/destinos?query=${encodeURIComponent(q)}`);
      if (!r.ok) return;
      const j = await r.json();
      const items = Array.isArray(j?.items) ? j.items : [];
      const list = items
        .map((l) => {
          const lat = Number(l.lat);
          const lng = Number(l.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return { id: l.id, name: l.nombre, type: l.tipo, lat, lng };
        })
        .filter(Boolean);
      setMarkers(list);
      setRoutePoints([]);
      setIsInfoCardVisible(false);
    } catch {}
  }, []);

  // ---- Seguimiento/posición/heading (Web APIs) ----
  useEffect(() => {
    // Geolocation watch
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy ?? 20 };
        userPosRef.current = p;
        lastAccRef.current = p.accuracy;
        // “fusión” simple
        if (!estPosRef.current) estPosRef.current = [p.lat, p.lng];
        const w = weightFromAccuracy(p.accuracy);
        const [elat, elng] = estPosRef.current;
        estPosRef.current = [elat * (1 - w) + p.lat * w, elng * (1 - w) + p.lng * w];

        // re-cámara si seguimos al usuario (sin rotación de mapa)
        if (followUser && isNavigationActive) {
          // aquí podrías emitir un callback para que el componente haga flyTo(estPosRef.current)
          // lo manejo en el componente con el botón “centrar” por simplicidad
        }

        // desvío y posible re-ruta
        if (isNavigationActive && routePoints.length >= 2) {
          const now = Date.now();
          const meters = distancePointToPolylineMeters([p.lat, p.lng], routePoints);
          if (meters > deviationThresholdM && now - lastRerouteTsRef.current > rerouteCooldownMs) {
            lastRerouteTsRef.current = now;
            // solicita re-ruta
            if (selectedPlace?.id) {
              fetch(`${BASE_URL}/ruta_desde_ubicacion?lat=${p.lat}&lng=${p.lng}&destino=${encodeURIComponent(selectedPlace.id)}`)
                .then((r) => (r.ok ? r.json() : null))
                .then((j2) => {
                  if (!j2) return;
                  const ruta = (j2.ruta || []).map((q) => [q.lat, q.lng]);
                  setRoutePoints(ruta);
                  const dist = Number(j2.distancia_total_metros ?? j2.distancia_m ?? 0);
                  const km = dist / 1000;
                  const velocidadKmH = 5.0;
                  const horas = km / velocidadKmH;
                  const minutos = horas * 60.0;
                  setDistanciaM(dist);
                  setTiempoMin(minutos);
                  setEtaDate(new Date(Date.now() + Math.round(minutos) * 60 * 1000));
                })
                .catch(() => {});
            }
          }
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 8000 }
    );

    // DeviceOrientation (heading)
    const onOrient = (e) => {
      let deg = e.alpha;
      if (typeof deg !== "number") return;
      // Filtro simple (sin smoothing fuerte)
      const rad = (deg * Math.PI) / 180.0;
      headingRadRef.current = normalizeAngle(0.96 * headingRadRef.current + 0.04 * rad);
    };
    window.addEventListener("deviceorientation", onOrient, { passive: true });

    return () => {
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", onOrient);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followUser, isNavigationActive, routePoints, selectedPlace?.id]);

  // ---- API públicas (como en tu controlador) ----
  const moveToUserLocation = useCallback(() => {
    // lo maneja el componente con map.flyTo(userPosRef.current)
    // este método solo existe por paridad
  }, []);

  const toggleFollowUser = useCallback(() => {
    setFollowUser((v) => !v);
  }, []);

  const startNavigation = useCallback(() => {
    if (!routePoints.length || !selectedPlace?.id) return;
    setIsNavigationActive(true);
    setFollowUser(true);
  }, [routePoints.length, selectedPlace?.id]);

  const stopNavigation = useCallback(() => {
    setIsNavigationActive(false);
    setFollowUser(false);
  }, []);

  const toggleNavigation = useCallback(() => {
    setIsNavigationActive((v) => !v);
  }, []);

  const onMapEvent = useCallback(() => {
    // si el usuario mueve el mapa manualmente y estamos siguiendo, deja de seguir
    if (followUser) setFollowUser(false);
  }, [followUser]);

  const onMarkerClick = useCallback((place) => {
    setSelectedPlace(place);
    setIsInfoCardVisible(true);
  }, []);

  // ---- helpers para UI (labels) ----
  const remainingMinutes = useMemo(() => {
    if (!etaDate) return Math.round(tiempoMin);
    const secs = Math.ceil((etaDate.getTime() - Date.now()) / 1000);
    return secs <= 0 ? 0 : Math.ceil(secs / 60);
  }, [etaDate, tiempoMin]);

  const distanciaLabel = useMemo(() => {
    if (distanciaM >= 1000) return `${(distanciaM / 1000).toFixed(1)} km`;
    return `${Math.round(distanciaM)} m`;
  }, [distanciaM]);

  const etaLabel = useMemo(() => {
    const d = etaDate || new Date(Date.now() + Math.round(tiempoMin) * 60 * 1000);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase();
  }, [etaDate, tiempoMin]);

  // ---- util interno ----
  async function getUserPosition() {
    if (!navigator.geolocation) return null;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy ?? 20 }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  return {
    // estado
    query, setQuery,
    suggestions,
    markers, setMarkers,
    routePoints, setRoutePoints,
    selectedPlace, setSelectedPlace,
    isInfoCardVisible, setIsInfoCardVisible,

    isNavigationActive,
    followUser,

    distanciaM, tiempoMin, etaDate,
    remainingMinutes, distanciaLabel, etaLabel,

    // acciones
    filterSuggestions,
    buscarYRutaDesdeBackend,
    mostrar_busqueda,
    moveToUserLocation,
    toggleFollowUser,
    startNavigation,
    stopNavigation,
    toggleNavigation,
    onMapEvent,
    onMarkerClick,

    // refs útiles para el componente (p.ej. centrar mapa)
    userPosRef,
    estPosRef,
    headingRadRef,
  };
}
