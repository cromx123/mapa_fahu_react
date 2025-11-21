// src/hooks/useAdminSolicitudes.js
import { useEffect, useState } from "react";

export default function useAdminSolicitudes() {
  const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtroEstado, setFiltroEstado] = useState("todos");

  const cargar = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/solicitudes/admin`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al cargar solicitudes");

      const data = await res.json();
      setSolicitudes(data);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  // Filtradas por estado actual
  const solicitudesFiltradas =
    filtroEstado === "todos"
      ? solicitudes
      : solicitudes.filter((s) => s.estado_actual === filtroEstado);

  return {
    solicitudes,
    solicitudesFiltradas,
    filtroEstado,
    setFiltroEstado,
    loading,
    error,
    reload: cargar,
  };
}
