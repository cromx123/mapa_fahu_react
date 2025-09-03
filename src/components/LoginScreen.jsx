// src/components/LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: "", pwd: "" });
  const [snack, setSnack] = useState(""); // Snack/alert suave

  const validate = () => {
    let ok = true;
    const next = { email: "", pwd: "" };

    if (!email.trim()) {
      next.email = "Por favor ingresa tu email";
      ok = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      next.email = "Email no válido";
      ok = false;
    }

    if (!pwd) {
      next.pwd = "Por favor ingresa tu contraseña";
      ok = false;
    } else if (pwd.length < 6) {
      next.pwd = "Mínimo 6 caracteres";
      ok = false;
    }

    setErrors(next);
    return ok;
  };

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (!validate()) return;

    setLoading(true);
    // Simulación de API (2s)
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);

    setSnack(`Bienvenido ${email}`);
    // Snack se oculta después de 2.5s y navega
    setTimeout(() => {
      setSnack("");
      navigate("/solicitudes_screen", { replace: true });
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <div className="mx-auto max-w-xl px-6 py-10">
        {/* Icono grande */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500 text-white grid place-items-center text-6xl">
            <span className="leading-none">👤</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center mt-4">Iniciar Sesión</h1>

        {/* Form */}
        <form className="mt-10 space-y-4" onSubmit={onSubmit} noValidate>
          {/* Email */}
          <div>
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-purple-50/40 ${
                errors.email ? "border-rose-400" : "border-purple-200"
              }`}
            >
              <span className="text-gray-700">✉️</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="Email"
                className="w-full bg-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-rose-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-purple-50/40 ${
                errors.pwd ? "border-rose-400" : "border-purple-200"
              }`}
            >
              <span className="text-gray-700">🔒</span>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full bg-transparent outline-none"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <button
                type="button"
                className="text-gray-600"
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
              className="text-sm text-purple-600 hover:underline"
              onClick={() => alert("Navegar a recuperación de contraseña")}
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
              className="w-full rounded-md bg-purple-50 text-purple-700 py-3 hover:bg-purple-100 border border-purple-200"
            >
              Ingresar
            </button>
          )}

          {/* Register */}
          <div className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              className="text-purple-700 hover:underline"
              onClick={() => alert("Navegar a registro")}
            >
              Regístrate
            </button>
          </div>
        </form>
      </div>

      {/* Snack minimalista */}
      {snack && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow">
          {snack}
        </div>
      )}
    </div>
  );
}
