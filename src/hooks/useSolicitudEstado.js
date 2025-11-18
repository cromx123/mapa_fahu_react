// hooks/useSolicitudEstado.js
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useSolicitudEstado(sol_id) {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si no hay id, no llamamos a la API
    if (!sol_id) {
      setError("No se recibió el ID de la solicitud");
      setLoading(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("No hay usuario logeado");
      setLoading(false);
      return;
    }

    const fetchSolicitud = async () => {
      try {
        const res = await fetch(`${API_URL}/solicitudes/${sol_id}/estados`);

        if (!res.ok) {
          throw new Error("No se pudieron obtener los estados de la solicitud");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setEstados(data);
        } else {
          setEstados([]);
        }
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [sol_id]); // <- importante: depende del id

  return { estados, loading, error };
}
