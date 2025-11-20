// src/hooks/useUserPerfil.js
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useUserPerfil() {
  const [perfil, setPerfil] = useState(null); // OBJETO, NO ARRAY
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("No hay usuario logeado");
      setLoading(false);
      return;
    }

    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/usuarios/${user.user_rut}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("No se pudieron obtener los datos del perfil");
        }

        const data = await res.json();
        setPerfil(data); 
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  return { perfil, loading, error };
}
