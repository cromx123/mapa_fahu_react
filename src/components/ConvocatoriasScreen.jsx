import React from "react";
import ServiceCard from "./ServiceCard";
import { MdSchool } from "react-icons/md";
import { useNavigate } from "react-router-dom";



export default function ConvocatoriasScreen() {
  const carreras = [
    { title: "PEDAGOGÍA EN INGLÉS", url: "https://fahu.usach.cl/ingles", color: "blue" },
    { title: "PEDAGOGÍA EN CASTELLANO", url: "https://fahu.usach.cl/castellano", color: "green" },
    { title: "LINGÜÍSTICA APLICADA A LA TRADUCCIÓN", url: "https://fahu.usach.cl/linguistica", color: "orange" },
    { title: "PERIODISMO", url: "https://fahu.usach.cl/periodismo", color: "purple" },
    { title: "LICENCIATURA EN ESTUDIOS INTERNACIONALES", url: "https://fahu.usach.cl/estudios-internacionales", color: "red" },
    { title: "PSICOLOGÍA", url: "https://fahu.usach.cl/psicologia", color: "teal" },
    { title: "PEDAGOGÍA EN FILOSOFÍA", url: "https://fahu.usach.cl/filosofia", color: "indigo" },
    { title: "LICENCIATURA EN HISTORIA", url: "https://fahu.usach.cl/historia", color: "cyan" },
    { title: "PEDAGOGÍA EN HISTORIA", url: "https://fahu.usach.cl/pedagogia-historia", color: "amber" },
  ];
  const navigate = useNavigate();
  
  return (
    <div className="h-screen w-full flex flex-col">
      <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ← 
        </button>  {/*Cambiar el icono por <*/}
        Convocatorias Ayudantías
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {carreras.map((c) => (
          <ServiceCard
            key={c.title}
            icon={<MdSchool className="text-xl" />}
            title={c.title}
            description="Ir al sitio web oficial"
            color={c.color}
            onClick={() => window.open(c.url, "_blank")}
          />
        ))}
      </div>
    </div>
  );
}
