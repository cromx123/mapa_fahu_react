// src/components/CameraFollow.jsx
import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export default function CameraFollow({
  followUser,
  isNavigationActive,
  HARD_LOCK_CENTER,
  userCoord,
  estPosRef,
  headingRadRef,
  offsetMeters,
}) {
  const map = useMap();
  const rafRef = useRef(null);

  // Recentrado periódico estilo "hard lock"
  useEffect(() => {
    if (!followUser || !userCoord) return;
    const tick = () => {
      const pos = estPosRef.current ?? [userCoord.lat, userCoord.lng];
      let target = pos;
      if (isNavigationActive) {
        const lookAheadM = 40;
        const dx = lookAheadM * Math.cos(headingRadRef.current);
        const dy = lookAheadM * Math.sin(headingRadRef.current);
        target = offsetMeters(pos, dx, dy);
      }
      const zoom = isNavigationActive ? Math.max(map.getZoom(), 19) : map.getZoom();
      map.flyTo(target, zoom, { duration: 0.25 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [followUser, isNavigationActive, userCoord, estPosRef, headingRadRef, map, offsetMeters]);

  // Si el usuario arrastra el mapa y está activado el "hard lock",
  // re-centramos inmediatamente (equivalente a tu onMapEvent + hardLockCenter)
  useMapEvents({
    dragend() {
      if (followUser && HARD_LOCK_CENTER && userCoord) {
        const pos = estPosRef.current ?? [userCoord.lat, userCoord.lng];
        map.flyTo(pos, map.getZoom(), { duration: 0.15 });
      }
    },
  });

  return null;
}
