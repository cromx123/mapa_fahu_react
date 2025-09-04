import React from "react";
import { useNavigate } from "react-router-dom";

export default function EstadosSolicitudesScreen() {

  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* AppBar */}
      <header className="bg-teal-600 text-white px-4 py-3 shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ← 
        </button>  {/*Cambiar el icono por <*/}
        <h1 className="text-lg font-bold">Solicitud</h1>
      </header>

      {/* Body */}
      <main className="p-4">
        <div className="space-y-2">
          <div className="p-3 bg-white shadow rounded">Estudiante</div>
          <div className="p-3 bg-white shadow rounded">Tipo de Solicitud</div>
          <div className="p-3 bg-white shadow rounded">Razones</div>
          <div className="p-3 bg-white shadow rounded">Documentos</div>
          <div className="p-3 bg-white shadow rounded">Estado de la solicitud</div>
          <div className="p-3 bg-white shadow rounded">Historial y firmas</div>
        </div>
      </main>
    </div>
  );
}
