import React from "react";
import AsideMenu from "./../AsideMenu";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import useDashboardData from "../../hooks/useDashboardAnalist";

export default function DashboardAnalista() {
  const { loading, data, error } = useDashboardData();

  

  const COLORS = ["#22c55e", "#f97316", "#ef4444"];
  const pre_data = JSON.parse(localStorage.getItem("user"));

  const TIPOS_USUARIO = Object.freeze({
      1: "Estudiante",
      3: "Analista",
      2: "Administrador",
    });

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Aside */}
      <AsideMenu />
      

      {/* Contenido */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
          <div className="flex justify-between items-center">
              <span>Dashboard</span>
              <div className="flex flex-col text-right leading-tight">
                <span className="font-semibold text-white">{pre_data.user_name}</span>
                <span className="text-sm text-gray-200">{TIPOS_USUARIO[pre_data.tipousuario_id]}</span>
              </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6 space-y-6">
          {loading && (
              <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-200">
                Cargando métricas...
              </div>
          )}
          {error && (
              <div className="flex items-center justify-center min-h-screen text-red-500">
                Error cargando datos: {error}
              </div>
          )}
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
              <p className="text-gray-500">Solicitudes asignadas</p>
              <h3 className="text-2xl font-bold">{data?.solicitudesAsignadas}</h3>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
              <p className="text-gray-500">En revisión</p>
              <h3 className="text-2xl font-bold">{data?.solicitudesEnRevision}</h3>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
              <p className="text-gray-500">Completadas hoy</p>
              <h3 className="text-2xl font-bold">{data?.completadasHoy}</h3>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">

            {/* Pie: Estado de solicitudes */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <h4 className="mb-2 font-semibold">Estado de solicitudes</h4>

              <PieChart width={300} height={250}>
                <Pie
                  data={[
                    { name: "Pendientes", value: data?.pendientes ?? 0 },
                    { name: "En proceso", value: data?.proceso ?? 0 },
                    { name: "Finalizadas", value: data?.finalizadas ?? 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                  <Cell fill={COLORS[2]} />
                </Pie>
              </PieChart>
            </div>

            {/* Bar: Tiempo promedio de resolución */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <h4 className="mb-2 font-semibold">Tiempo promedio (días)</h4>

              <BarChart
                width={350}
                height={250}
                data={[
                  { name: "Última semana", value: data?.promedioSemana },
                  { name: "Último mes", value: data?.promedioMes },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" />
              </BarChart>
            </div>

          </div>

          {/* Lista de tareas */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h4 className="font-semibold mb-4">Tareas pendientes</h4>

            <ul className="space-y-2">
              {data?.tareas?.length > 0 ? (
                data.tareas.map((t, i) => (
                  <li
                    key={i}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    • {t}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No tienes tareas pendientes 🎉</p>
              )}
            </ul>
          </div>

        </main>
      </div>
    </div>
  );
}