// src/components/LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [emailUser, setEmailUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({ emailUser: "", pwd: "" });
  const [snack, setSnack] = useState("");

  const validate = () => {
    let ok = true;
    const next = { emailUser: "", pwd: "" };

    // Validar "usuario" del correo (sin dominio)
    if (!emailUser.trim()) {
      next.emailUser = "Por favor ingresa tu usuario USACH";
      ok = false;
    } else if (!/^[^\s@]+$/.test(emailUser.trim())) {
      next.emailUser = "Usuario no válido (no uses espacios ni @)";
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

    const fullEmail = `${emailUser.trim().toLowerCase()}@usach.cl`;

    const result = await login(fullEmail, pwd);

    if (result?.redirectVerify) {
      navigate("/verificar-cuenta");
      return;
    }

    if (result?.error) {
      const msg =
        typeof result.error === "string"
          ? result.error
          : result.error?.msg
            ? result.error.msg
            : JSON.stringify(result.error);

      setSnack(msg);
      return;
    }

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

          {/* Usuario USACH (sin @usach.cl) */}
          <div>
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-2 
              bg-purple-50/40 dark:bg-gray-800
              ${errors.emailUser ? "border-rose-400" : "border-purple-200 dark:border-gray-700"}
              `}
            >
              <span className="text-gray-700 dark:text-gray-300">📧</span>
              <input
                type="text"
                placeholder="usuario (sin @usach.cl)"
                className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100"
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
              />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                @usach.cl
              </span>
            </div>
            {errors.emailUser && (
              <p className="text-sm text-rose-600 mt-1">{errors.emailUser}</p>
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
          {typeof snack === "string" ? snack : JSON.stringify(snack)}
        </div>
      )}
    </div>
  );
}
