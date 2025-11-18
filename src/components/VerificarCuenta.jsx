import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useVerificarCuenta from "../hooks/useVerificarCuenta";

export default function VerificarCuenta() {
  const navigate = useNavigate();
  const { verificar, loading, error, mensaje } = useVerificarCuenta();

  const [codigo, setCodigo] = useState("");
  const [searchParams] = useSearchParams();

  const rutParam = searchParams.get("rut");
  const codeParam = searchParams.get("code");

  // AUTO-VERIFICACIÓN si el link trae parámetros
  useEffect(() => {
    const autoVerify = async () => {
      if (rutParam && codeParam) {
        const ok = await verificar(rutParam, codeParam);

        if (ok) {
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      }
    };

    autoVerify();
  }, [rutParam, codeParam, verificar, navigate]);

  const user = JSON.parse(localStorage.getItem("user_pending"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rut = rutParam || user?.user_rut;
    if (!rut) return;

    const ok = await verificar(rut, codigo);
    if (ok) {
      localStorage.removeItem("user_pending");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md border dark:border-gray-700">

        <h2 className="text-2xl font-bold text-center mb-4 text-teal-600">
          Verificar Cuenta
        </h2>

        {rutParam && codeParam ? (
          <p className="text-center mb-4 text-gray-600 dark:text-gray-300">
            Verificando tu cuenta automáticamente...
          </p>
        ) : (
          <p className="text-center mb-4 text-gray-600 dark:text-gray-300">
            Ingresa el código de verificación enviado a tu correo.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!rutParam && (
            <input
              type="text"
              placeholder="Código de verificación"
              className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          )}

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          {mensaje && (
            <p className="text-green-600 text-center">{mensaje}</p>
          )}

          {!rutParam && (
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>
          )}
        </form>

        <button
          className="w-full mt-4 text-sm text-gray-500 dark:text-gray-400 hover:underline"
          onClick={() => navigate("/login")}
        >
          Volver al login
        </button>

      </div>
    </div>
  );
}
