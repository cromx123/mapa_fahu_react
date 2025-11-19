import React from "react";
import AppHeader from "../components/AppHeader";

function ServiceCard({ icon, title, sub, color, onClick }) {
  return (
    <button className="svc-card" onClick={onClick}>
      <div className="pill" style={{ background: color.bg, color: color.fg }}>{icon}</div>
      <div className="svc-text">
        <div className="svc-title">{title}</div>
        <div className="svc-sub">{sub}</div>
      </div>
      <div className="svc-right">›</div>
    </button>
  );
}

export default function ServiciosScreen({ goBack }) {
  return (
    <div className="screen">
      <AppHeader title="Servicios" onBack={goBack} />
      <div className="svc-list">
        <ServiceCard
          icon="💼"
          title="Convocatorias Ayudantías"
          sub="Oportunidades para postular a ayudantías"
          color={{ bg:"#efe8ff", fg:"#3b82f6" }}
          onClick={() => alert("Convocatorias")}
        />
        <ServiceCard
          icon="🎓"
          title="Programas Académicos"
          sub="Información sobre carreras y programas"
          color={{ bg:"#eaf5ef", fg:"#22c55e" }}
          onClick={() => alert("Programas")}
        />
        <ServiceCard
          icon="📅"
          title="Calendario Académico"
          sub="Fechas importantes del año académico"
          color={{ bg:"#fff1e6", fg:"#f59e0b" }}
          onClick={() => alert("Calendario")}
        />
        <ServiceCard
          icon="❓"
          title="Asesorías Estudiantiles"
          sub="Orientación y apoyo estudiantil"
          color={{ bg:"#efe8ff", fg:"#8b5cf6" }}
          onClick={() => alert("Asesorías")}
        />
      </div>
    </div>
  );
}
