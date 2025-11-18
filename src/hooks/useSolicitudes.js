import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("No hay usuario logeado");
      setLoading(false);
      return;
    }

    const fetchSolicitudes = async () => {
      try {
        const res = await fetch(
          `${API_URL}/solicitudes/usuario/${user.user_rut}`
        );

        if (!res.ok) {
          throw new Error("No se pudieron obtener las solicitudes");
        }

        const data = await res.json();

        // ✔ Si no hay solicitudes, NO es un error
        if (Array.isArray(data)) {
          setSolicitudes(data);
        } else {
          setSolicitudes([]);
        }

      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  return { solicitudes, loading, error };
}
