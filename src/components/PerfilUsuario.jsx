// src/components/AyudaSolicitudesScreen.jsx
import React, { useState } from "react";
import AsideMenu from "./AsideMenu";
import useUserPerfil from "../hooks/useUserPerfil";
import { useNavigate } from "react-router-dom";

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

function isSegura(password) {
  if (!password) return null;

  const letrasLower = /[a-z]/.test(password);
  const letrasMayus = /[A-Z]/.test(password);
  const tieneNum = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const muyAlta = letrasLower && letrasMayus && tieneNum && hasSymbol && password.length >= 12;
  const alta = letrasLower && letrasMayus && tieneNum && hasSymbol && password.length >= 10;
  const media = letrasLower && letrasMayus && tieneNum && password.length >= 8;
  const baja = password.length > 0;

  if (muyAlta) {
    return <span className="text-green-400 ml-3">Muy alta</span>;
  }

  if (alta) {
    return <span className="text-green-300 ml-3">Alta</span>;
  }

  if (media) {
    return <span className="text-yellow-300 ml-3">Media</span>;
  }

  if (baja) {
    return <span className="text-red-300 ml-3">Baja</span>;
  }
  return null;
}

export default function PerfilUsuario() {
  const { perfil, loading, error } = useUserPerfil();
  const pre_data = JSON.parse(localStorage.getItem("user"));
  const [nombre, setNombre] = React.useState("");
  const [rut, setRut] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [fono, setFono] = React.useState("");
  const [carrera, setCarrera] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = useState(false);

  const fullPhone = formatearPhone(pre_data.user_phone);
  const rutFormateado =formatearRut(pre_data.user_rut);
  const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

  const [actualizado, setActualizado] = React.useState(false);
  const [ShowNpwd, setShowNpwd] = React.useState(false);
  const navigate = useNavigate();
    
  const TIPOS_USUARIO = Object.freeze({
    1: "Estudiante",
    2: "Analista",
    3: "Administrador",
  });

  React.useEffect(() => {
    if (perfil) {
      setNombre(perfil.user_name || "");
      setRut(perfil.user_rut || "");
      setCorreo(perfil.user_correo || "");
      setFono(perfil.user_phone || "");
      setCarrera(perfil.user_carrera || "");
    }
  }, [perfil]);

  const reloadPerfil = async () => {
    const res = await fetch(`${API_URL}/usuarios/${pre_data.user_rut}`, {
      credentials: "include",
    });

    const newPerfil = await res.json();

    setNombre(newPerfil.user_name);
    setRut(newPerfil.user_rut);
    setCorreo(newPerfil.user_correo);
    setFono(newPerfil.user_phone);
    setCarrera(newPerfil.user_carrera);

    setActualizado(false);
  };


  const onSubmitPassword = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("Completa el campo requerido");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios/${pre_data.user_rut}/password`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Error al actualizar la contraseña");
        return;
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }

    // Cerrar sesión
    localStorage.removeItem("user");
    navigate("/");
  }


  const onSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !rut || !correo) {
      alert("Completa todos los campos requeridos.");
      return;
    }

    try {
      // Esto se guarda en la tabla Solicitud
      const reqBody = {
        user_name: nombre,
        user_rut: rut,
        user_correo: correo,
        user_phone: fono,
        user_carrera: carrera,
        tipousuario_id: pre_data.tipousuario_id
      };

      const res = await fetch(`${API_URL}/usuarios/${pre_data.user_rut}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reqBody),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Error al actualizar los datos");
        return;
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
    setActualizado(true);
  };


  return (
      <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        {/* ASIDE */}
        <AsideMenu />

        {/* CONTENIDO */}
        <div className="flex-1 flex flex-col">
          
          {/* TOP BAR */}
          <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
            <div className="flex justify-between items-center">
              <span>Perfil</span>
              <div className="flex flex-col text-right leading-tight">
                <span className="font-semibold text-white">{pre_data.user_name}</span>
                <span className="text-sm text-gray-200">{TIPOS_USUARIO[pre_data.tipousuario_id]}</span>
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
            <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              { loading &&(
                <p className="text-center text-gray-500 dark:text-gray-300">Cargando Perfil...</p>
              )}
              {error && (
                <p className="text-center text-red-600 dark:text-red-400">{error}</p>
              )}
              { !loading && !error && perfil &&(
                <form onSubmit={onSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-3">Datos Personales</h2>

                  <ul className="space-y-3">
                    <li>
                      <span className="font-bold inline-block w-20 dark:text-white-400">Nombre:</span>
                      <input
                        type="text"
                        className="mx-3 p-2 rounded-md border border-black dark:border-gray-100 outline-none bg-transparent inline-block w-80"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                      />
                    </li>

                    <li>
                      <span className="font-bold inline-block w-20 dark:text-white-400">Rut:</span>
                      <input
                        type="text"
                        className="mx-3 p-2 rounded-md border border-black dark:border-gray-100 outline-none bg-transparent inline-block w-80 opacity-50 cursor-not-allowed"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                      />
                      <span className="mx-3 p-2 text-gray-800 dark:text-gray-200 opacity-50 outline-none bg-transparent inline-block w-auto">El rut de usuario no puede ser cambiado.</span>
                    </li>

                    <li className="">
                      <div className="inline-block w-auto">
                        <span className="font-bold inline-block w-20 dark:text-white-400">Correo:</span>
                        <input
                          type="email"
                          className="mx-3 p-2 rounded-md border border-black dark:border-gray-100 outline-none bg-transparent inline-block w-80"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          required
                        />
                      </div>
                      <span className="my-3 text-gray-800 dark:text-gray-200 opacity-50 outline-none bg-transparent inline-block w-100">Si cambias el correo, se te enviará un correo electrónico a tu nueva dirección para confirmarlo. La nueva dirección no se convertirá en la activa hasta que se confirme.</span>
                      
                    </li>

                    <li>
                      <span className="font-bold  inline-block w-20 dark:text-white-400">Phone:</span>
                      <input
                        type="text"
                        className="mx-3 p-2 rounded-md border border-black dark:border-gray-100 outline-none bg-transparent inline-block w-80"
                        value={fono}
                        onChange={(e) => setFono(e.target.value)}
                      />
                      <span className="mx-3 p-2 text-gray-800 dark:text-gray-200 opacity-50 outline-none bg-transparent inline-block w-auto">sin (+56)</span>
                    </li>

                    {pre_data.tipousuario_id === 1 && (
                      <li>
                        <span className="font-bold inline-block w-20 dark:text-white-400">Carrera:</span>
                        <input
                          type="text"
                          className="mx-3 p-2 rounded-md border border-black dark:border-gray-100 outline-none bg-transparent inline-block w-80 opacity-50 cursor-not-allowed"
                          value={carrera}
                          onChange={(e) => setCarrera(e.target.value)}
                          
                        />
                      </li>
                    )}
                  </ul>

                  <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                  >
                    Actualizar datos
                  </button>
                </form>
                
              )}
              {actualizado && (
                <div className="mt-6 p-4 border border-green-600 bg-green-100 text-green-800 rounded-lg">
                  <p className="font-semibold">Datos personales actualizados correctamente.</p>

                  <button
                    onClick={reloadPerfil}
                    className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                  >
                    Mostrar datos actualizados
                  </button>
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-3">Cambio de Contraseña</h2>
                <ul>
                  <li>
                    <span className="mr-6 font-bold inline-block w-auto dark:text-white-400">Contraseña:</span>
                    <button
                      onClick={() => setShowNpwd((v) => !v)}
                      className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                    >
                      Actualizar contraseña
                    </button>
                    {ShowNpwd && (
                      <div className="mt-6 p-4 border border-gray-800 bg-gray-100 text-gray-800 dark:bg-gray-700 rounded-lg">
                        <form onSubmit={onSubmitPassword} className="space-y-4">

                          <input
                            type={showPwd ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            className=" py-2 px-4 w-auto bg-transparent outline-none border text-gray-900 border-black dark:border-gray-400 rounded-md dark:text-gray-100"
                            value={password}
                            onChange={(e) => {
                              const sinEspacios =e.target.value.replace(/\s+/g,"");
                              setPassword(sinEspacios);
                            }
                            }
                          />

                          <button
                            type="button"
                            className="mx-4 text-gray-600 dark:text-gray-300"
                            onClick={() => setShowPwd((v) => !v)}
                          >
                            {showPwd ? "🙈 Ocultar" : "👁️ Mostrar"}
                          </button>
                          {isSegura(password)}

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setShowNpwd(false)}
                              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                            >
                              Cancelar
                            </button>

                            <button
                              type="submit"
                              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                            >
                              Confirmar
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </li>
                </ul>
                
            </section>
          </main>
        </div>
      </div>
  );
}
