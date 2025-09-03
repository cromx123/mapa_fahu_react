import L from "leaflet";
import { Marker, Circle } from "react-leaflet";
import { useMemo } from "react";

export default function HeadingLocationMarkerLion({
  coord,
  headingRad = 0,
  accuracyM = 20,
  walking = false,
  speedMps = 0,
}) {
  const icon = useMemo(() => {
    if (!coord) return null;

    const deg = (headingRad * 180) / Math.PI;
    // Duración del paso: 350–1200 ms según velocidad
    const stepMs = Math.max(350, Math.min(1200, 1200 - speedMps * 400));
    const playState = walking && speedMps > 0.1 ? "running" : "paused";

    const html = `
      <div class="heading-marker-lion" style="width:56px;height:56px;display:flex;align-items:center;justify-content:center;transform:rotate(${deg}deg);">
        <svg class="lion bob" width="48" height="48" viewBox="0 0 48 48"
             style="animation-duration:${stepMs}ms;animation-play-state:${playState}">
          <ellipse cx="24" cy="40" rx="12" ry="4" fill="rgba(0,0,0,0.18)"/>
          <ellipse cx="26" cy="26" rx="12" ry="8" fill="#c58a2d" stroke="#8b5e1a" stroke-width="1"/>
          <path d="M 17 26 C 10 24, 10 20, 8 18" fill="none" stroke="#8b5e1a" stroke-width="2" stroke-linecap="round"/>
          <circle cx="8" cy="18" r="2.5" fill="#8b5e1a"/>

          <g class="leg"
             style="animation-duration:${stepMs}ms;animation-play-state:${playState}">
            <rect x="18" y="28" width="6" height="12" rx="3" fill="#c58a2d" stroke="#8b5e1a" stroke-width="1"/>
            <rect x="30" y="28" width="6" height="12" rx="3" fill="#c58a2d" stroke="#8b5e1a" stroke-width="1"/>
          </g>

          <g>
            <circle cx="36" cy="20" r="8.5" fill="#9c5a19" stroke="#6e3f12" stroke-width="1"/>
            <circle cx="36" cy="20" r="6" fill="#f0b44a" stroke="#8b5e1a" stroke-width="1"/>
            <circle cx="34.3" cy="19" r="0.9" fill="#1f2937"/>
            <circle cx="37.7" cy="19" r="0.9" fill="#1f2937"/>
            <ellipse cx="36" cy="22.3" rx="2.4" ry="1.6" fill="#f5deb3" stroke="#8b5e1a" stroke-width="0.8"/>
            <circle cx="36" cy="21.6" r="0.7" fill="#1f2937"/>
          </g>

          <g class="leg back"
             style="animation-duration:${stepMs}ms;animation-delay:${stepMs/2}ms;animation-play-state:${playState}">
            <rect x="16" y="28" width="6" height="12" rx="3" fill="#a87824" stroke="#8b5e1a" stroke-width="1"/>
            <rect x="28" y="28" width="6" height="12" rx="3" fill="#a87824" stroke="#8b5e1a" stroke-width="1"/>
          </g>
        </svg>
      </div>
    `;

    return L.divIcon({ html, className: "heading-marker-lion", iconSize: [56, 56] });
  }, [coord, headingRad, walking, speedMps]);

  if (!coord || !icon) return null;

  return (
    <>
      <Circle
        center={[coord.lat, coord.lng]}
        radius={Math.max(accuracyM || 20, 5)}
        pathOptions={{ color: "#60a5fa", fillOpacity: 0.08 }}
      />
      <Marker position={[coord.lat, coord.lng]} icon={icon} />
    </>
  );
}
