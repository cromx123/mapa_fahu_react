// public/icons/mapIcons.js
import L from "leaflet";

// PNG por defecto de Leaflet (solo para el fallback tipo "pin")
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Helper: crea íconos cuadrados (32x32) sin sombra
const makeIcon = (url, size = 32) =>
  L.icon({
    iconUrl: url,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });


const makeMarkerIcon = () =>
  new L.Icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const icons = {
  camino: makeIcon("/icons/camino.png"),

  // Servicios
  bano: makeIcon("/icons/bano.png"),
  baño: makeIcon("/icons/bano.png"), // alias
  bebedero: makeIcon("/icons/bebedero.png"),
  entrada: makeIcon("/icons/entrada.png"),
  estacionamiento: makeIcon("/icons/estacionamiento.png"),
  casino: makeIcon("/icons/casino.png"),
  kiosco: makeIcon("/icons/kiosco.png"),
  kiosko: makeIcon("/icons/kiosco.png"), // alias

  // Académicos / edificios
  sala: makeIcon("/icons/sala.png"),
  laboratorio: makeIcon("/icons/laboratorio.png"),
  auditorio: makeIcon("/icons/auditorio.png"),
  biblioteca: makeIcon("/icons/biblioteca.png"),
  departamento: makeIcon("/icons/departamento.png"),
  patios: makeIcon("/icons/patios.png"),
  escalera: makeIcon("/icons/escalera.png"),

  estructuras: {
    "monumento a víctor jara": makeIcon("/icons/estructuras/victor-jara.png"),
    "mural niña": makeIcon("/icons/estructuras/mural-nina.png"),
    "placa parque la rosa": makeIcon("/icons/estructuras/placa-parque-rosa.png"),
    "escultura fae": makeIcon("/icons/estructuras/escultura-fae.png"),
    "obelisco humanidades": makeIcon("/icons/estructuras/obelisco-humanidades.png"),
  },

  deporte: {
    piscina: makeIcon("/icons/deporte/piscina.png"),
    estadio: makeIcon("/icons/deporte/estadio.png"),
    "sala de pesas": makeIcon("/icons/deporte/mancuernas.png"),
    "cancha básquetbol": makeIcon("/icons/deporte/basquetbol.png"),
    "cancha tenis": makeIcon("/icons/deporte/tenis.png"),
    "cancha de futbol": makeIcon("/icons/deporte/futbol.png"),
    multicancha: makeIcon("/icons/deporte/multicancha.png"),
    gimnasio: makeIcon("/icons/deporte/gimnasio.png"),
    camarines: makeIcon("/icons/deporte/camarines.png"),
  },

  // Fallback
  default: makeMarkerIcon(),
};


export function getIcon(type, subtype) {
  if (subtype && icons[type] && typeof icons[type] === "object") {
    return icons[type][subtype] || icons.default;
  }
  return icons[type] || icons.default;
}

// Exporta ambas formas para evitar errores de import
export const nodeIcons = icons;
export default icons;
