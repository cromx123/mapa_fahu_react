import React, { useState } from "react";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export default function EstadoSolicitudScreen({ goBack }) {
  const [folio, setFolio] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultar = async () => {
    setLoading(true);
    try {
      let res = null;
      if (BASE_URL) {
        const r = await fetch(`${BASE_URL}/estado?folio=${encodeURIComponent(folio)}`);
        if (r.ok) res = await r.json();
      }
      setStatus(res || { estado: "En revisión", actualizado: new Date().toLocaleString() });
    } catch {
      setStatus({ estado: "Desconocido", actualizado: "—" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button className="mb-4 px-3 py-2 rounded bg-slate-800 text-white" onClick={goBack}>⬅ Volver</button>
      <h1 className="text-xl font-bold mb-4">Estado de Solicitud</h1>

      <div className="flex gap-2 mb-3">
        <input className="input flex-1" placeholder="Folio / RUT" value={folio} onChange={(e) => setFolio(e.target.value)} />
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={consultar} disabled={!folio || loading}>
          {loading ? "Buscando..." : "Consultar"}
        </button>
      </div>

      {status && (
        <div className="p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between">
            <span className="font-semibold">Estado</span>
            <span>{status.estado}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Actualizado</span>
            <span>{status.actualizado}</span>
          </div>
        </div>
      )}
    </div>
  );
}
