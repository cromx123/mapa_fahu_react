
function bearing(from, to) {
  const lat1 = (from[0] * Math.PI) / 180;
  const lat2 = (to[0] * Math.PI) / 180;
  const dLon = ((to[1] - from[1]) * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function distanciaMetros(a, b) {
  const R = 6371000; // radio tierra en metros
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function normDeg(d) {
  // normaliza a [-180, 180)
  return ((d + 180) % 360 + 360) % 360 - 180;
}

export function generarInstrucciones(puntos, {
  straightToleranceDeg = 30,  // tolerancia para considerar "recto"
} = {}) {
  const pasos = [];
  if (!puntos || puntos.length < 2) return pasos;

  const segs = [];
  for (let i = 0; i < puntos.length - 1; i++) {
    segs.push({
      dist: distanciaMetros(puntos[i], puntos[i + 1]),
      bearing: bearing(puntos[i], puntos[i + 1]),
    });
  }
  if (segs.length === 0) return pasos;

  let accRecto = segs[0].dist; 
  for (let i = 1; i < segs.length; i++) {
    const dif = Math.abs(normDeg(segs[i].bearing - segs[i - 1].bearing));

    if (dif < straightToleranceDeg) {
      accRecto += segs[i].dist;
    } else {
      pasos.push({
        tipo: "recto",
        dist: accRecto,
        texto: `Sigue recto por ${accRecto.toFixed(0)} m`,
      });
      let tipo = "uturn";
      let texto = "Haz un cambio de sentido";
      if (dif >= straightToleranceDeg && dif < 150) {
        const signed = normDeg(segs[i].bearing - segs[i - 1].bearing);
        if (signed > 0) {
          tipo = "derecha";
          texto = "Gira a la derecha";
        } else {
          tipo = "izquierda";
          texto = "Gira a la izquierda";
        }
      }
      pasos.push({ tipo, dist: 0, texto });

      accRecto = segs[i].dist;
    }
  }

  if (accRecto > 0) {
    pasos.push({
      tipo: "recto",
      dist: accRecto,
      texto: `Sigue recto por ${accRecto.toFixed(0)} m`,
    });
  }

  pasos.push({ tipo: "llegada", dist: 0, texto: "Has llegado a tu destino" });

  return pasos;
}

