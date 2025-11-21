import { useState } from "react";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useVerificarCorreo() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [estado, setEstado] = useState(null); // "verificada", "expirado", "invalido"

  const verificarCorreo = async (rut, token) => {
    setLoading(true);
    setMensaje("");
    setError("");
    setEstado(null);

    try {
      const res = await fetch(
        `${API_URL}/usuarios/confirmar-correo?rut=${rut}&token=${token}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Error al verificar correo");
        setEstado("invalido");
        return false;
      }

      // Evaluar respuestas del backend
      if (data.estado === "verificada") {
        setMensaje("Correo verificado correctamente ✔");
        setEstado("verificada");
        return true;
      }

      if (data.estado === "expirado") {
        setError("El código expiró. Se enviará uno nuevo.");
        setEstado("expirado");
        return false;
      }

      setError("Código inválido o enlace incorrecto.");
      setEstado("invalido");
      return false;

    } catch (err) {
      setError("Error de conexión con el servidor");
      setEstado("invalido");
      return false;

    } finally {
      setLoading(false);
    }
  };

  return { verificarCorreo, loading, mensaje, error, estado };
}