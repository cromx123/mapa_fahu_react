// src/components/AyudaSolicitudesScreen.jsx
import React from "react";
import AsideMenu from "./AsideMenu";

export default function AyudaSolicitudesScreen() {
  const data = JSON.parse(localStorage.getItem("user"));
  
  const TIPOS_USUARIO = Object.freeze({
    1: "Estudiante",
    3: "Analista",
    2: "Administrador",
  });

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
            <div className="flex flex-col text-right leading-tight">
              <span className="font-semibold text-white">{data.user_name}</span>
              <span className="text-sm text-gray-200">{TIPOS_USUARIO[data.tipousuario_id]}</span>
            </div>
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
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold mb-3">Estados de las Solicitudes</h2>

            <ul className="space-y-3">

              <li>
                <span className="inline-block w-32 font-bold text-orange-400">Pendiente:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  La solicitud fue enviada y está en espera de revisión.
                </span>
              </li>

              <li>
                <span className="inline-block w-32 font-bold text-yellow-400">En análisis:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  El equipo está revisando los documentos y fundamentos.
                </span>
              </li>

              <li>
                <span className="inline-block w-32 font-bold text-green-600">Aceptado:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  Tu solicitud fue aprobada.
                </span>
              </li>

              <li>
                <span className="inline-block w-32 font-bold text-red-600">Rechazado:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  La solicitud no cumplió con los requisitos.
                </span>
              </li>

            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold mb-3">¿Cómo se determina la seguridad de tu contraseña?</h2>

            <ul className="space-y-3">

              {/* Poco segura */}
              <li>
                <span className="inline-block w-40 font-bold text-red-500">Poco segura:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  No cumple con los requisitos mínimos.  
                  <br />
                  <strong>Falla si falta alguno de estos:</strong> tener 8 caracteres, una mayúscula, una minúscula o un número.
                </span>
              </li>

              {/* Media segura */}
              <li>
                <span className="inline-block w-40 font-bold text-yellow-500">Media segura:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  Cumple con lo básico para ser aceptable.  
                  <br />
                  <strong>Requisitos mínimos:</strong>  
                  8+ caracteres, una mayúscula, una minúscula y un número.
                </span>
              </li>

              {/* Segura */}
              <li>
                <span className="inline-block w-40 font-bold text-lime-400">Segura:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  Contraseña fuerte y difícil de adivinar.  
                  <br />
                  <strong>Requisitos mínimos:</strong>  
                  10+ caracteres, mayúsculas, minúsculas, números y al menos un símbolo.
                </span>
              </li>

              {/* Altamente segura */}
              <li>
                <span className="inline-block w-40 font-bold text-emerald-600">Altamente segura:</span>
                <span className="mx-3 p-2 inline-block text-gray-700 dark:text-gray-300">
                  Nivel máximo de robustez recomendada.  
                  <br />
                  <strong>Requisitos mínimos:</strong>  
                  12+ caracteres, mayúsculas, minúsculas, números, símbolos y sin espacios.
                </span>
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
