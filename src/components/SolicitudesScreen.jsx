// src/components/SolicitudesScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base64LogoHeader, base64LogoFooter } from "./FotoScreen";
import useSolicitudes from "../hooks/useSolicitudes";
import AsideMenu from "./AsideMenu";

const USACH_ORANGE = "#E77500";

export default function SolicitudesScreen() {
  const navigate = useNavigate();
  const { solicitudes, loading, error } = useSolicitudes();
  const [periodo, setPeriodo] = useState("Primer semestre del año 2025");
  const data = JSON.parse(localStorage.getItem("user"));

  const getEstadoStyles = (estado) => {
    if (!estado) return {};

    const estadoLower = estado.toLowerCase();

    // RECHAZADO
    if (estadoLower.includes("Rechazado")) {
      return {
        bg: "bg-red-100 dark:bg-red-900",
        fg: "text-red-800 dark:text-red-300"
      };
    }

    // ACEPTADO
    if (estadoLower.includes("Aceptado")) {
      return {
        bg: "bg-green-100 dark:bg-green-900",
        fg: "text-green-800 dark:text-green-300"
      };
    }
    if (estadoLower.includes("nálisis")) {
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        fg: "text-yellow-800 dark:text-yellow-300"
      };
    }
    // RESTO DE ESTADOS
    return {
      bg: "bg-orange-100 dark:bg-orange-900",
      fg: "text-orange-800 dark:text-orange-300"
    };
  };


  const logosState = useMemo(
    () => ({
      logoHeader: base64LogoHeader,
      logoFooter: base64LogoFooter,
    }),
    []
  );


  const tipoOptions = {
    "3ra_opcion_1req": "Cursar asignatura en 3ra. opción -1 req.",
    "reinc_titulacion": "Reincorporación titulación fuera de plazo",
    "3ra_opcion_sr": "Cursar asignatura en 3ra. opción S/R",
    "prorroga": "Prórroga fuera de plazo",
    "tutoria_r": "Cursar asignatura por tutoría (asig. R)",
    "retiro_temporal": "Retiro Temporal fuera de plazo",
    "sin_req": "Cursar asignatura c/s req. (R)",
    "ampliacion": "Ampliación fuera de plazo",
    "reincorporacion": "Reincorporación fuera de plazo",
    "Otros": "Otros"
  };
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const totalPages = Math.ceil(solicitudes.length / ITEMS_PER_PAGE);

  const solicitudesPagina = solicitudes.slice(startIndex, endIndex);

  const TIPOS_USUARIO = Object.freeze({
    1: "Estudiante",
    2: "Analista",
    3: "Administrador",
  });

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900">


      <AsideMenu />

      <div className="flex-1 flex flex-col">
        {/* AppBar */}
        <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
          <div className="flex justify-between items-center">
            <span>Solicitudes</span>
            <div className="flex flex-col text-right leading-tight">
              <span className="font-semibold text-white">{data.user_name}</span>
              <span className="text-sm text-gray-200">{TIPOS_USUARIO[data.tipousuario_id]}</span>
            </div>

          </div>
        </header>

        <div className="flex-1 p-4 space-y-4 text-gray-900 dark:text-gray-100">

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
          {loading && (
            <p className="text-center text-gray-500 dark:text-gray-300">Cargando solicitudes...</p>
          )}

          {error && (
            <p className="text-center text-red-600 dark:text-red-400">{error}</p>
          )}

          {!loading && !error && solicitudes.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-300">
              No tienes solicitudes registradas.
            </p>
          )}
          {!loading && !error && solicitudes.length > 0 && (
            <>
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
                      {solicitudesPagina.map((s, i) => {
                        const est = getEstadoStyles(s.estado);
                        console.log("ESTADO SOLICITUD:", s);
                        return (
                          <tr
                            key={i}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="py-3 px-3">{startIndex + i + 1}</td>
                            <td className="py-3 px-3">{tipoOptions[s.tipo] ?? "Tipo desconocido"}</td>
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
                                onClick={() => navigate("/estado_solicitud", { state: { solicitudId: s.sol_id, solicitudTipo: tipoOptions[s.tipo] ?? "Tipo desconocido", solicitudFundamentos: s.fundamentos } })}
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
                {solicitudesPagina.map((s, i) => {
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
                      <div className="text-lg font-bold">Solicitud #{startIndex + i + 1}</div>

                      <div className="mt-3 flex">
                        <div className="font-semibold w-20">Tipo :</div>
                        <div className="flex-1">{tipoOptions[s.tipo] ?? "Tipo desconocido"}</div>
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
                          onClick={() => navigate("/estado_solicitud", { state: { solicitudId: s.sol_id, solicitudTipo: tipoOptions[s.tipo] ?? "Tipo desconocido", solicitudFundamentos: s.fundamentos } })}
                        >
                          👁️ Acciones
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ‹ Anterior
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente ›
            </button>

            <span className="text-gray-600 dark:text-gray-300">
              Página {currentPage} de {totalPages}, mostrando {solicitudesPagina.length} registro(s)
              de un total de {solicitudes.length}
            </span>
          </div>


        </div>
      </div>
    </div>
  );
}
