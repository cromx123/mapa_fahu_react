import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useVerificarCorreo from "../hooks/useVerificarCorreo";

export default function VerificacionCorreo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { verificarCorreo, loading, estado, mensaje } = useVerificarCorreo();

  const rut = searchParams.get("rut");
  const token = searchParams.get("token");
  const [contador, setContador] =useState(15); 

  // Ejecutar verificación automática
  useEffect(() => {
    if (!rut || !token ) return;

    const verificar = async () => {
        await verificarCorreo(rut, token);
      }

    verificar();
  }, []);

  useEffect(() => {
    if (estado !== "verificada") return;

    let interval = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [estado]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md border dark:border-gray-700">

        <h2 className="text-2xl font-bold text-center mb-4 text-teal-600">
          Verificación de Correo
        </h2>

        {/* ESTADOS */}
        <div className="text-center mb-4">
          {loading && (
            <p className="text-gray-600 dark:text-gray-300">
              Verificando tu correo...
            </p>
          )}

          {mensaje && (
            <p
              className={`text-lg font-medium ${
                estado === "verificada"
                  ? "text-green-600"
                  : estado === "expirado"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {mensaje}
            </p>
          )}
        </div>

        {/* SI ESTA VERIFICADO → contador */}
        {estado === "verificada" && (
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
              Serás redirigido al login en <strong>{contador}</strong> segundos.
            </p>
        )}

        {/* BOTÓN PARA IR AL LOGIN */}
        <button
          className="w-full mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
          onClick={() => navigate("/login")}
        >
          Ir al Login
        </button>
      </div>
    </div>
  );
}