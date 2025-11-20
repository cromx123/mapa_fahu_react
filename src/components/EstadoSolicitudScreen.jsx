// src/components/EstadosSolicitudesScreen.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useSolicitudEstado from "../hooks/useSolicitudEstado";
import { ChevronLeft } from "lucide-react";

export default function EstadosSolicitudesScreen() {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();
  const solicitudId = location.state?.solicitudId;
  const solicitudTipo = location.state?.solicitudTipo;  
  const solicitudFundamentos = location.state?.solicitudFundamentos;

  const { estados, loading, error } = useSolicitudEstado(solicitudId);
  console.log("Estados obtenidos:", estados);
  if (loading) return <p>Cargando estados...</p>;
  if (error) return <p>{error}</p>;

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
  const ultimo = estados[estados.length - 1];
  const estilos = getEstadoStyles(ultimo?.estado_nombre);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* AppBar */}
      <header className="bg-teal-600 text-white px-4 py-3 shadow flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
        <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold">Estados de Solicitud</h1>
      </header>

      {/* Body */}
      <main className="p-4">
        <div className="space-y-2">
          <div className="p-3 bg-white dark:bg-gray-800 shadow rounded font-bold">
            Estudiante
            <h3 className=" my-3 font-normal text-uppercase">{data?.user_name}</h3>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 shadow rounded font-bold">
            Tipo de Solicitud
            <h3 className=" my-3 font-normal">{solicitudTipo}</h3>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 shadow rounded font-bold">
            Razones
            <h3 className=" my-3 font-normal">{solicitudFundamentos}</h3>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 shadow rounded font-bold">
            Documentos
          </div>
          
          <div className="p-3 bg-white dark:bg-gray-800 shadow rounded font-bold">
            Estado de la solicitud
            <br />
            {estados.length > 0 ? (
              <h3 className={`margin font-semibold mt-2 inline-block px-3 py-1 rounded-md ${estilos.bg} ${estilos.fg}`}>
                {ultimo.estado_nombre}
              </h3>
            ) : (
              <h3 className="text-gray-500 font-normal">Estado no disponible</h3>
            )}
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 shadow rounded font-bold">
            Historial y firmas
            {estados.length === 0 ? (
              <p className="mt-2 font-normal">No hay estados registrados para esta solicitud.</p>
            ) :
              <div class="table-responsive">
                <table class="table table-bordered table-striped align-middle shadow-sm font-normal">
                    <tbody>

                        <tr>
                            <td>Estudiante</td>
                            {estados[1] && estados[1].estado_nombre === "Recepcionado" ? (
                              <td> ✅</td>
                            ) :<td> ⏳</td>}
                            {estados[1] && estados[1].fecha ? (
                              <td>{new Date(estados[1].fecha).toLocaleString()}</td>
                            ) : (
                              <td>No ha sido enviado a secretaría</td>
                            )}
                        </tr>

                        <tr>
                            <td>Secretaría carrera</td>
                            {estados[2] && estados[2].estado_nombre === "En análisis" ? (
                              <td> ✅</td>
                            ) :<td> ⏳</td>}
                            {estados[2] && estados[2].fecha ? (
                              <td>{new Date(estados[2].fecha).toLocaleString()}</td>
                            ) : (
                              <td></td>
                            )}
                        </tr>

                        <tr>
                            <td>Registrador curricular</td>
                            {estados[3] && estados[3].estado_nombre === "PENDIENTE" ? (
                              <td> ✅</td>
                            ) :<td> ⏳</td>}
                            {estados[3] && estados[3].fecha ? (
                              <td>{new Date(estados[3].fecha).toLocaleString()}</td>
                            ) : (
                              <td></td>
                            )}
                        </tr>

                        <tr>
                            <td>Analista de carrera</td>
                            {estados[4] && estados[4].estado_nombre === "PENDIENTE" ? (
                              <td> ✅</td>
                            ) :<td> ⏳</td>}
                            {estados[4] && estados[4].fecha ? (
                              <td>{new Date(estados[4].fecha).toLocaleString()}</td>
                            ) : (
                              <td></td>
                            )}
                        </tr>

                    </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  );
}
