import React, { useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export default function ConfirmarFormularioScreen({ goBack, formData }) {
  const [sending, setSending] = useState(false);
  const data = formData || {};

  const enviar = async () => {
    try {
      setSending(true);
      if (BASE_URL) {
        await fetch(`${BASE_URL}/formulario_cae`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      alert("Formulario enviado ✅");
      goBack?.();
    } catch (e) {
      alert("No se pudo enviar. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button className="mb-4 px-3 py-2 rounded bg-slate-800 text-white" onClick={goBack}>⬅ Volver</button>
      <h1 className="text-xl font-bold mb-4">Confirmar datos</h1>

      <div className="grid gap-2 mb-4">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="flex justify-between border-b py-2">
            <span className="font-medium">{k}</span>
            <span className="text-slate-700">{String(v || "-")}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-slate-200" onClick={goBack}>Editar</button>
        <button disabled={sending} className="px-3 py-2 rounded bg-green-600 text-white" onClick={enviar}>
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
