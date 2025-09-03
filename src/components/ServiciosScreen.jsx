// src/components/ServiciosScreen.jsx
import React from "react";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";

export default function ServiciosScreen() {
  const navigate = useNavigate();

  const servicios = [
    {
      title: "Convocatorias Ayudantías",
      subtitle: "Oportunidades para postular a ayudantías",
      color: "blue",
      onClick: () => navigate("/convocatorias"),
      icon: "🧰",
    },
    {
      title: "Programas Académicos",
      subtitle: "Información sobre carreras y programas",
      color: "green",
      onClick: () => alert("Programas Académicos seleccionado"),
      icon: "🎓",
    },
    {
      title: "Calendario Académico",
      subtitle: "Fechas importantes del año académico",
      color: "orange",
      onClick: () => alert("Calendario seleccionado"),
      icon: "🗓️",
    },
    {
      title: "Asesorías Estudiantiles",
      subtitle: "Orientación y apoyo estudiantil",
      color: "purple",
      onClick: () => alert("Asesorías seleccionadas"),
      icon: "❓",
    },
    {
      title: "Eventos y Actividades",
      subtitle: "Listado de eventos y actividades del mes actual",
      color: "red",
      onClick: () => alert("Eventos seleccionado"),
      icon: "📍",
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ← 
        </button>  {/*Cambiar el icono por <*/}
        Servicios
      </header>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4">
        {servicios.map((s) => (
          <ServiceCard
            key={s.title}
            icon={s.icon}
            title={s.title}
            description={s.subtitle}
            color={s.color}
            onClick={s.onClick}
          />
        ))}
      </div>
    </div>
  );
}
