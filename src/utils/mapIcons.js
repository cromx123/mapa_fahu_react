//public/icons/mapIcons.js
import L from "leaflet";

// Reutilizamos los PNG por defecto de Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Puedes usar tus propios PNG/SVG en /public/icons
const bibliotecaIcon = L.icon({
  iconUrl: "/icons/biblioteca.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const casinoIcon = new L.Icon({
  iconUrl: "/icons/casino.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const kiocoIcon = new L.Icon({
  iconUrl: "/icons/tienda.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const banoIcon = new L.Icon({
  iconUrl: "/icons/bano.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const salaIcon = new L.Icon({
  iconUrl: "/icons/sala.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const piscinaIcon = L.icon({
  iconUrl: "/icons/piscina.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Fallback: ícono por defecto
const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Exportamos un diccionario
export const nodeIcons = {
  biblioteca: bibliotecaIcon,
  casino: casinoIcon,
  kiosko: kiocoIcon,
  baño: banoIcon,
  sala: salaIcon,
  deporte: {
    piscina: piscinaIcon,
//    cancha: canchaIcon,
//    tenis: tenisIcon,
//    pesas: pesasIcon,
  },
  default: defaultIcon,
};
