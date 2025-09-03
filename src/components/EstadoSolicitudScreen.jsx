import React from "react";

export default function EstadosSolicitudesScreen() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* AppBar */}
      <header className="bg-teal-600 text-white px-4 py-3 shadow">
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
