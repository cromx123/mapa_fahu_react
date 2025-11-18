import { useState } from "react";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useVerificarCuenta() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const verificar = async (rut, codigo) => {
    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const res = await fetch(
        `${API_URL}/auth/verify?rut=${rut}&code=${codigo}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Error al verificar");
        return false;
      }

      setMensaje("Cuenta verificada correctamente ✔");
      return true;

    } catch (err) {
      setError("Error de conexión");
      return false;

    } finally {
      setLoading(false);
    }
  };

  return { verificar, loading, mensaje, error };
}
