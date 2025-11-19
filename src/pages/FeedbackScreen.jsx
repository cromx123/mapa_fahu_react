import React, { useState } from "react";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export default function FeedbackScreen({ goBack }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);

  const enviar = async () => {
    try {
      setSending(true);
      if (BASE_URL) {
        await fetch(`${BASE_URL}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, rating }),
        });
      }
      alert("¡Gracias por tu comentario!");
      goBack?.();
    } catch {
      alert("No se pudo enviar.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button className="mb-4 px-3 py-2 rounded bg-slate-800 text-white" onClick={goBack}>⬅ Volver</button>
      <h1 className="text-xl font-bold mb-4">Feedback</h1>

      <label className="block mb-2 font-medium">Calificación</label>
      <input
        type="range"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full mb-4"
      />

      <textarea
        className="input min-h-32"
        placeholder="Cuéntanos tu experiencia…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-3 flex gap-2">
        <button className="px-3 py-2 rounded bg-slate-200" onClick={goBack}>Cancelar</button>
        <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={enviar} disabled={sending || !text}>
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
