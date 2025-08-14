import L from "leaflet";
import { Marker, Circle } from "react-leaflet";
import { useMemo } from "react";

export default function HeadingLocationMarker({ coord, headingRad, accuracyM }) {
  const icon = useMemo(() => {
    if (!coord) return null;
    const deg = ((headingRad || 0) * 180) / Math.PI;
    const html = `
      <div style="width:32px;height:32px;transform:rotate(${deg}deg);display:flex;align-items:center;justify-content:center;">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <polygon points="12,2 18,20 12,16 6,20" fill="#2563eb" stroke="white" stroke-width="1"/>
        </svg>
      </div>`;
    return L.divIcon({ html, className: "heading-marker", iconSize: [32, 32] });
  }, [coord, headingRad]);

  if (!coord || !icon) return null;

  return (
    <>
      <Circle center={[coord.lat, coord.lng]} radius={Math.max(accuracyM || 20, 5)} />
      <Marker position={[coord.lat, coord.lng]} icon={icon} />
    </>
  );
}
