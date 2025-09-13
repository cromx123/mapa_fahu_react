// src/components/ConfirmarFormularioScreen.jsx
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
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button
          onClick={goBack}
          className="mr-3 text-xl px-3 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
        >
          ⬅
        </button>
        <h1 className="text-2xl font-bold">Confirmar datos</h1>
      </header>

      {/* Lista de datos */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 p-4 mb-6">
        <div className="grid gap-3">
          {Object.entries(data).map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
            >
              <span className="font-medium">{k}</span>
              <span className="text-gray-700 dark:text-gray-300">
                {String(v || "-")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="max-w-2xl mx-auto flex gap-3">
        <button
          onClick={goBack}
          className="flex-1 rounded-md px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
        >
          Editar
        </button>
        <button
          onClick={enviar}
          disabled={sending}
          className={`flex-1 rounded-md px-4 py-2 font-semibold text-white transition ${
            sending
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
