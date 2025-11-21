import { useState } from "react";

export default function useComentarios() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const agregarComentario = async (id, texto, esInterno) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/solicitudes/comentario/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ texto, es_interno: esInterno }),
        }
      );

      if (!res.ok) throw new Error("Error al agregar comentario.");

      return true;

    } catch (err) {
      setError(err.message);
      return false;

    } finally {
      setLoading(false);
    }
  };

  return { agregarComentario, loading, error };
}