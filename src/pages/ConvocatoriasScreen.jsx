import React from "react";

function Convocatoria({ title, date, href }) {
  return (
    <a
      className="block p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-600">{date}</p>
    </a>
  );
}

export default function ConvocatoriasScreen({ goBack }) {
  const items = [
    { title: "Ayudantías Semestrales FAHU", date: "Postula hasta: 30/08/2025", href: "#" },
    { title: "Fondos Concursables Estudiantiles", date: "Cierre: 15/09/2025", href: "#" },
    { title: "Intercambio Académico 2026-1", date: "Cierre: 01/11/2025", href: "#" },
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button className="mb-4 px-3 py-2 rounded bg-slate-800 text-white" onClick={goBack}>⬅ Volver</button>
      <h1 className="text-xl font-bold mb-4">Convocatorias</h1>

      <div className="grid gap-3">
        {items.map((it, i) => <Convocatoria key={i} {...it} />)}
      </div>
    </div>
  );
}
