// src/components/SolicitudesScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base64LogoHeader, base64LogoFooter } from "./FotoScreen";

const USACH_ORANGE = "#E77500";

export default function SolicitudesScreen() {
  const navigate = useNavigate();

  const [solicitudes] = useState([
    {
      tipo: "Ampliación fuera de plazo",
      estado: "Recepcionado",
      fechaCreacion: "22/07/2025 12:24",
      ultimaActualizacion: "22/07/2025 12:24",
      documento: true,
    },
    {
      tipo: "Reincorporación por reprobación por segunda o más veces",
      estado: "Aceptada",
      fechaCreacion: "10/07/2025 17:24",
      ultimaActualizacion: "10/07/2025 17:24",
      documento: true,
    },
  ]);

  const [periodo, setPeriodo] = useState("Primer semestre del año 2025");

  const getEstadoStyles = (estado) => {
    if (estado === "Aceptada") {
      return { bg: "bg-green-100 dark:bg-green-900", fg: "text-green-800 dark:text-green-300" };
    }
    if (estado?.includes("Despachado")) {
      return { bg: "bg-orange-100 dark:bg-orange-900", fg: "text-orange-800 dark:text-orange-300" };
    }
    return { bg: "bg-orange-100 dark:bg-orange-900", fg: "text-orange-800 dark:text-orange-300" };
  };

  const logosState = useMemo(
    () => ({
      logoHeader: base64LogoHeader,
      logoFooter: base64LogoFooter,
    }),
    []
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* AppBar */}
      <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ←
        </button>
        Solicitudes
      </header>

      <div className="flex-1 p-4 space-y-4">
        {/* Barra de filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <option>Primer semestre del año 2025</option>
          </select>

          <button
            className="rounded-md bg-gray-100 dark:bg-gray-700 border px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => alert("Filtrar (placeholder)")}
          >
            Filtrar
          </button>

          <button
            className="rounded-md text-white px-4 py-2"
            style={{ backgroundColor: USACH_ORANGE }}
            onClick={() =>
              navigate("/formulario_cae", { state: { ...logosState } })
            }
          >
            Nueva solicitud
          </button>
        </div>

        {/* Desktop: tabla */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Tipo de solicitud</th>
                  <th className="py-2 px-3">Estado</th>
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">Documento</th>
                  <th className="py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s, i) => {
                  const est = getEstadoStyles(s.estado);
                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-3">{i + 1}</td>
                      <td className="py-3 px-3">{s.tipo}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-md text-sm ${est.bg} ${est.fg}`}
                        >
                          {s.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div>Creación: {s.fechaCreacion}</div>
                        <div>Actualización: {s.ultimaActualizacion}</div>
                      </td>
                      <td className="py-3 px-3">
                        {s.documento && (
                          <span className="text-blue-600 dark:text-blue-400">📄</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          className="rounded-md border px-3 py-1 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600"
                          onClick={() => navigate("/estado_solicitud")}
                          title="Ver estado"
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="md:hidden space-y-4">
          {solicitudes.map((s, i) => {
            const estadoColor =
              s.estado === "Aceptada"
                ? "text-green-700 dark:text-green-300"
                : s.estado?.includes("Despachado")
                ? "text-[#E77500]"
                : "text-orange-700 dark:text-orange-300";

            return (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="text-lg font-bold">Solicitud #{i + 1}</div>

                <div className="mt-3 flex">
                  <div className="font-semibold w-20">Tipo :</div>
                  <div className="flex-1">{s.tipo}</div>
                </div>

                <div className="mt-2 flex items-center">
                  <div className="font-semibold w-20">Estado:</div>
                  <div className={`font-bold ${estadoColor}`}>{s.estado}</div>
                </div>

                <div className="mt-2 flex">
                  <div className="font-semibold w-20">Fecha :</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Creación: {s.fechaCreacion}
                    <br />
                    Actualización: {s.ultimaActualizacion}
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-white"
                    style={{ backgroundColor: USACH_ORANGE }}
                    onClick={() => alert("Abrir documento")}
                  >
                    📄 Documento
                  </button>

                  <button
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-white"
                    style={{ backgroundColor: USACH_ORANGE }}
                    onClick={() => navigate("/estado_solicitud")}
                  >
                    👁️ Acciones
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
