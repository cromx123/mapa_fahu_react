// src/components/LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [rut, setRut] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [errors, setErrors] = useState({ rut: "", pwd: "" });
  const [snack, setSnack] = useState("");

  const validate = () => {
    let ok = true;
    const next = { rut: "", pwd: "" };

    // Validar RUT
    if (!rut.trim()) {
      next.rut = "Por favor ingresa tu RUT";
      ok = false;
    } else if (!/^[0-9]+[-|‐]?[0-9kK]$/.test(rut.trim())) {
      next.rut = "RUT no válido";
      ok = false;
    }

    // Validar contraseña
    if (!pwd) {
      next.pwd = "Por favor ingresa tu contraseña";
      ok = false;
    }

    setErrors(next);
    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(rut, pwd);

    if (result?.redirectVerify) {
      navigate("/verificar-cuenta");
      return;
    }

    if (result?.error) {
      setSnack(result.error);
      return;
    }

    // Si login OK → redirige
    navigate("/solicitudes_screen", { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-xl px-6 py-10">

        {/* Icono */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500 text-white grid place-items-center text-6xl">
            <span className="leading-none">👤</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center mt-4">Iniciar Sesión</h1>

        {/* Form */}
        <form className="mt-10 space-y-4" onSubmit={onSubmit} noValidate>

          {/* RUT */}
          <div>
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-2 
              bg-purple-50/40 dark:bg-gray-800
              ${errors.rut ? "border-rose-400" : "border-purple-200 dark:border-gray-700"}
              `}
            >
              <span className="text-gray-700 dark:text-gray-300">🪪</span>
              <input
                type="text"
                placeholder="RUT (ej: 11111111-1)"
                className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </div>
            {errors.rut && (
              <p className="text-sm text-rose-600 mt-1">{errors.rut}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-2 
              bg-purple-50/40 dark:bg-gray-800
              ${errors.pwd ? "border-rose-400" : "border-purple-200 dark:border-gray-700"}
              `}
            >
              <span className="text-gray-700 dark:text-gray-300">🔒</span>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <button
                type="button"
                className="text-gray-600 dark:text-gray-300"
                onClick={() => setShowPwd((v) => !v)}
                title={showPwd ? "Ocultar" : "Mostrar"}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.pwd && (
              <p className="text-sm text-rose-600 mt-1">{errors.pwd}</p>
            )}
          </div>

          {/* Forgot */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-purple-600 hover:underline dark:text-purple-400"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Submit */}
          {loading ? (
            <div className="flex justify-center py-3">
              <span className="animate-spin inline-block w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            <button
              type="submit"
              className="w-full rounded-md bg-purple-50 text-purple-700 py-3 hover:bg-purple-100 border border-purple-200 
              dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700 dark:border-purple-500"
            >
              Ingresar
            </button>
          )}

        </form>
      </div>

      {/* Snack */}
      {snack && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow dark:bg-gray-800">
          {snack}
        </div>
      )}
    </div>
  );
}
