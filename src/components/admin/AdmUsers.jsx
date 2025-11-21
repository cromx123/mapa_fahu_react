// src/pages/admin/AdminUsuarios.jsx
import React, { useEffect, useState } from "react";
import AsideMenu from "../../components/AsideMenu";

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

function formatearPhone(phone) {
  if (!phone) return "";

  phone = phone.replace(/\D/g, "");
  if (phone.length === 9 && phone.startsWith("9")) {
    const cuerpo_1 = phone.slice(1, 5);
    const cuerpo_2 = phone.slice(-4)
    return `+56 9 ${cuerpo_1} ${cuerpo_2}`;
  }
  return phone;
}

export default function AdminUsuarios() {
  const pre_data = JSON.parse(localStorage.getItem("user"));
  const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const TIPOS = {
    1: "Estudiante",
    3: "Analista",
    2: "Administrador",
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`, { credentials: "include" });
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    }
    setLoading(false);
  };

  const filtrados = usuarios.filter((u) =>
    u.user_name.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.user_rut.includes(busqueda)
  );

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 text-gray-100">

      <AsideMenu />

      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
          <div className="flex justify-between items-center">
            <span>Administración de Usuarios</span>
            <div className="flex flex-col text-right leading-tight">
              <span className="font-semibold">{pre_data.user_name}</span>
              <span className="text-sm text-gray-200">{TIPOS[pre_data.tipousuario_id]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">

          {/* Buscador */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Buscar Usuarios</h2>

            <input
              type="text"
              placeholder="Buscar por nombre o RUT..."
              className="px-4 py-2 w-full rounded-md border dark:bg-gray-700"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </section>

          {/* Tabla */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Listado de Usuarios</h2>

            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="py-2">Nombre</th>
                    <th>RUT</th>
                    <th>Correo</th>
                    <th>Phono</th>
                    <th>Tipo</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((u) => {
                    const rutConPuntos = formatearRut(u.user_rut);
                    const celuFotamato = formatearPhone(u.user_phone);
                    return (
                      <tr key={u.user_rut} className="border-b dark:border-gray-700">
                        <td className="py-2">{u.user_name}</td>
                        <td>{rutConPuntos}</td>
                        <td>{u.user_correo}</td>
                        <td>{celuFotamato}</td>
                        <td>{TIPOS[u.tipousuario_id]}</td>
                        <td className="text-center">
                          <button className="px-3 py-1 bg-blue-600 rounded text-white mr-2">Editar</button>
                          <button className="px-3 py-1 bg-red-600 rounded text-white">Bloquear</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}