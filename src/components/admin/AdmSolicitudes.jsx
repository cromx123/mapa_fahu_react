// src/pages/admin/AdminSolicitudes.jsx
import React, { useEffect, useState } from "react";
import AsideMenu from "../../components/AsideMenu";
import useAdminSolicitudes from "../../hooks/useAdminSolicitudes";

function formatearRut(rut) {
  rut = rut.replace(/[.\s]/g, "").toUpperCase();

  const partes = rut.split("-");
  let cuerpo = partes[0];
  const dv = partes[1];

  cuerpo = cuerpo
    .split("")
    .reverse()
    .join("")
    .replace(/(\d{3})(?=\d)/g, "$1.")
    .split("")
    .reverse()
    .join("");

  return `${cuerpo}-${dv}`;
}

export default function AdminSolicitudes() {
  const pre_data = JSON.parse(localStorage.getItem("user"));
  const [filtro, setFiltro] = useState("todos");
  const { solicitudes, loading, error } = useAdminSolicitudes();
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");

  
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
  let solicitudesFiltradas = [...solicitudes];
  
    // FILTRAR ESTADO
  if (filtroEstado) {
    solicitudesFiltradas = solicitudesFiltradas.filter(
      (s) => s.estado === filtroEstado
    );
  }
  
    // FILTRAR TIPO
  if (filtroTipo) {
    solicitudesFiltradas = solicitudesFiltradas.filter(
      (s) => s.tipo === filtroTipo
    );
  }
  
    // FILTRAR POR FECHA
  if (filtroFecha) {
    const ahora = new Date();
  
    solicitudesFiltradas = solicitudesFiltradas.filter((s) => {
      const fecha = new Date(s.fechaCreacion);
  
      if (filtroFecha === "hoy") {
        return fecha.toDateString() === ahora.toDateString();
      }
  
      if (filtroFecha === "semana") {
        const hace7 = new Date();
        hace7.setDate(ahora.getDate() - 7);
        return fecha >= hace7;
      }
  
      if (filtroFecha === "mes") {
        const hace30 = new Date();
        hace30.setDate(ahora.getDate() - 30);
        return fecha >= hace30;
      }
  
      return true;
    });
  }
  
    // FILTRAR POR DOCUMENTO
  if (filtroDocumento === "con") {
    solicitudesFiltradas = solicitudesFiltradas.filter((s) => s.documento);
  }
  
  if (filtroDocumento === "sin") {
    solicitudesFiltradas = solicitudesFiltradas.filter((s) => !s.documento);
  }
  
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  const solicitudesPagina = solicitudesFiltradas.slice(startIndex, endIndex);
  const totalPages = Math.ceil(solicitudesFiltradas.length / ITEMS_PER_PAGE);

  const TIPOS = {
    1: "Estudiante",
    3: "Analista",
    2: "Administrador",
  };

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

  const filtradas =
    filtro === "todos" ? solicitudes : solicitudes.filter((s) => s.estado_actual === filtro);

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 text-gray-100">

      <AsideMenu />

      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
          <div className="flex justify-between items-center">
            <span>Gestión de Solicitudes</span>
            <div className="flex flex-col text-right leading-tight">
              <span className="font-semibold">{pre_data.user_name}</span>
              <span className="text-sm text-gray-200">{TIPOS[pre_data.tipousuario_id]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          
          {/* Filtros */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>

            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">Estado</label>
            <select
              className="mr-3 mb-3 px-4 py-2 rounded-md border dark:bg-gray-700"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Recepcionado">Recepcionado</option>
              <option value="En análisis">En análisis</option>
              <option value="En Registro Curricular">En Registro Curricular</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>

            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">Tipo Formulario</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="mr-3 mb-3 px-4 py-2 rounded-md border dark:bg-gray-700"
            >
              <option value="">Todos</option>
              {Object.keys(tipoOptions).map((key) => (
                <option key={key} value={key}>{tipoOptions[key]}</option>
              ))}
            </select>
          
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">Fecha</label>
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full mt-1 mb-4 rounded-md bg-gray-100 dark:bg-gray-700 p-2"
            >
              <option value="">Todas</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>
          </section>
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
              <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Solicitudes</h2>

                {loading ? (
                  <p>Cargando...</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b dark:border-gray-600">
                        <th className="py-2">ID</th>
                        <th>RUT</th>
                        <th>Documento</th>
                        <th>Estado actual</th>
                        <th className="text-center">Fecha</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((s) => {
                        const est = getEstadoStyles(s.estado);
                        const rutConPuntos = formatearRut(s.sol_rut);
                        return(
                          <tr key={s.sol_id} className="border-b dark:border-gray-700">
                            <td className="py-2">{s.sol_id}</td>
                            <td>{rutConPuntos}</td>
                            <td>{s.documento}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-block px-2 py-1 rounded-md text-sm ${est.bg} ${est.fg}`}
                              >
                              {s.estado}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                                <div>Creación: {s.fechaCreacion}</div>
                                <div>Actualización: {s.ultimaActualizacion}</div>
                            </td>
                            <td className="text-center">
                              <button className="px-3 py-1 bg-blue-600 rounded text-white mr-2">
                                Ver detalle
                              </button>
                              <button className="px-3 py-1 bg-green-600 rounded text-white">
                                Cambiar estado
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </section>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}