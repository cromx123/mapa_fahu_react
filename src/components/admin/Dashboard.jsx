import React, { useState } from "react";
import AsideMenu from "./../AsideMenu";
import useDashboardAdmin from "../../hooks/useDashboardAdmin";
import BarraConFiltros from "../GraficoBarras";

import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

export default function DashboardAdmin() {

    const {data, loading, error }= useDashboardAdmin();    
    const COLORS = ["#0088FE", "#FF8042"];

    const pre_data = JSON.parse(localStorage.getItem("user"));
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
                <span>Dashboard</span>
                <div className="flex flex-col text-right leading-tight">
                  <span className="font-semibold text-white">{pre_data.user_name}</span>
                  <span className="text-sm text-gray-200">{TIPOS_USUARIO[pre_data.tipousuario_id]}</span>
                </div>
              </div>
            </header>
        
            { loading &&(
                <p className="text-center text-gray-500 dark:text-gray-300">Cargando datos...</p>
            )}
            {error && (
                <p className="text-center text-red-600 dark:text-red-400">{error}</p>
            )}
            { !loading && !error && data &&(
              <main className="flex-1 p-6 space-y-6">

                  <div className="flex gap-2 mb-20">
                      <div className="p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg/20 text-center">
                          <span>Cantidad de Solicitudes</span> 
                          <h3>{loading? "..." : data.total_solicitudes}</h3>
                      </div>
                      <div className="p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg/20 text-center">
                          <span>Cantidad de Usuarios</span>
                          <h3>{loading? "..." : data.total_usuarios}</h3>
                      </div>
                      <div className="p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg/20 text-center">
                          <pan>Cantidad de Documentos</pan>
                          <h3>{loading? "..." : data.total_documentos}</h3>
                      </div>
                  </div>

                  {/* Charts */}
                  <div className="flex gap-3">
                      <div className="m-3 p-3 w-auto bg-white dark:bg-gray-800 rounded-2xl p-15 shadow-lg/20 ">
                          <h4>Solicitudes por mes</h4>
                          <BarraConFiltros data={data.grafico_barras}/>
                      </div>

                      <div className="m-3 p-3 w-auto bg-white dark:bg-gray-800 rounded-2xl p-15 shadow-lg/20">
                          <h4>Tendencias del Formulario C.A.E</h4>
                          <AreaChart width={400} height={250} data={data.grafico_area}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                          <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
                          </AreaChart>
                      </div>

                      <div className="m-3 p-3 w-auto bg-white dark:bg-gray-800 rounded-2xl p-15 shadow-lg/20">
                          <h4>% de tipos de Solicitudes</h4>
                          <PieChart width={250} height={250}>
                          <Tooltip
                            formatter={(value, name, props) => [`${value}`, props.payload.name]}
                          />
                          <Pie
                              data={data.grafico_pie}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                          {data.grafico_pie.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                          </Pie>
                          </PieChart>
                      </div>
                  </div>
              </main>
            )}
          </div>    
        </div>
    );
}