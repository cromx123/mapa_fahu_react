// src/hooks/useAdminUsuarios.js
import { useEffect, useState } from "react";

export default function useAdminUsuarios() {
  const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al cargar usuarios");

      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  return {
    usuarios,
    loading,
    error,
    reload: cargar,
  };
}