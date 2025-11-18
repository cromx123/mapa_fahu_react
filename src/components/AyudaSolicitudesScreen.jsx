// src/components/AyudaSolicitudesScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AsideMenu from "./AsideMenu";

export default function AyudaSolicitudesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* ASIDE */}
      <AsideMenu />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">
        
        {/* TOP BAR */}
        <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
          <div className="flex justify-between items-center">
            <span>Ayuda</span>
          </div>
        </header>

        {/* BODY */}
        <main className="flex-1 p-6 space-y-6">

          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">¿Qué puedo hacer en esta sección?</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              En esta página encontrarás información sobre cómo funcionan las solicitudes,
              cuáles son los plazos, y cómo interpretar el estado de cada trámite.
            </p>
          </section>

          {/* Estados de Solicitud */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Estados de las Solicitudes</h2>

            <ul className="space-y-3">
              <li>
                <span className="font-bold text-orange-600">Pendiente:</span>
                <span className="text-gray-700 dark:text-gray-300"> La solicitud fue enviada y está en espera de revisión.</span>
              </li>

              <li>
                <span className="font-bold text-yellow-600">En análisis:</span>
                <span className="text-gray-700 dark:text-gray-300"> El equipo está revisando los documentos y fundamentos.</span>
              </li>

              <li>
                <span className="font-bold text-green-600">Aceptado:</span>
                <span className="text-gray-700 dark:text-gray-300"> Tu solicitud fue aprobada.</span>
              </li>

              <li>
                <span className="font-bold text-red-600">Rechazado:</span>
                <span className="text-gray-700 dark:text-gray-300"> La solicitud no cumplió con los requisitos.</span>
              </li>
            </ul>
          </section>

          {/* Contacto */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Contacto y Soporte</h2>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Si necesitas asistencia adicional, puedes comunicarte con:
            </p>

            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>📧 <strong>camila.berrios.s@usach.cl</strong></li>
              <li>📞 <strong>+56 9 12346789</strong></li>
              <li>🏢 Analista Vicecanato de Docencia - Facultad de Humanidades</li>
            </ul>
          </section>

        </main>
      </div>
    </div>
  );
}
