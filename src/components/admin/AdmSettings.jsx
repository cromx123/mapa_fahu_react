// src/pages/admin/AdminSettings.jsx
import React from "react";
import AsideMenu from "../../components/AsideMenu";

export default function AdminSettings() {
  const pre_data = JSON.parse(localStorage.getItem("user"));

  const TIPOS = {
    1: "Estudiante",
    3: "Analista",
    2: "Administrador",
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 text-gray-100">

      <AsideMenu />

      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
          <div className="flex justify-between items-center">
            <span>Configuración del Sistema</span>
            <div className="flex flex-col text-right leading-tight">
              <span className="font-semibold">{pre_data.user_name}</span>
              <span className="text-sm text-gray-200">{TIPOS[pre_data.tipousuario_id]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">

          {/* Bloque 1 */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Administrar Tipos</h2>

            <ul className="space-y-3">
              <li>
                <button className="px-4 py-2 bg-teal-600 rounded text-white">
                  Tipos de Documentos
                </button>
              </li>
              <li>
                <button className="px-4 py-2 bg-teal-600 rounded text-white">
                  Tipos de Estados
                </button>
              </li>
            </ul>
          </section>

          {/* Bloque 2 */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Logs del Sistema</h2>
            <p className="text-gray-300">
              Accede a los errores y eventos registrados.
            </p>

            <button className="mt-3 px-4 py-2 bg-red-600 rounded text-white">
              Ver Logs
            </button>
          </section>

        </main>
      </div>
    </div>
  );
}