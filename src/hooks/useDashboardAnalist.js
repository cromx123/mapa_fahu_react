import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useDashboardAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/analista/dashboard`, {
        credentials: "include"
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.detail || "Error al cargar el dashboard");
        return;
      }

      setData(json);
    } catch (e) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { data, loading, error, refetch: fetchDashboard };
}