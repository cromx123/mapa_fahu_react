// src/hooks/useFirmas.js
import { useEffect, useState, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useFirmas() {
  const [firmas, setFirmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarFirmas = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/firmas/mis`, {
        method: "GET",
        credentials: "include", // cookie JWT
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }

      if (!res.ok) {
        throw new Error("No se pudieron obtener las firmas");
      }

      const data = await res.json();
      setFirmas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarFirmas();
  }, [cargarFirmas]);

  const crearFirma = async (nombre, archivo) => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("archivo", archivo);

    const res = await fetch(`${API_URL}/firmas/`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Error al crear la firma");
    }

    // recargar lista
    await cargarFirmas();
    return data;
  };

  const eliminarFirma = async (firma_id) => {
    const res = await fetch(`${API_URL}/firmas/${firma_id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok && res.status !== 204) {
      throw new Error("Error al eliminar la firma");
    }

    await cargarFirmas();
  };

  const actualizarFirma = async (firma_id, nombre, archivo) => {
    const formData = new FormData();
    if (nombre) formData.append("nombre", nombre);
    if (archivo) formData.append("archivo", archivo);

    const res = await fetch(`${API_URL}/firmas/${firma_id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Error al actualizar la firma");
    }

    await cargarFirmas();
    return data;
  };

  return {
    firmas,
    loading,
    error,
    crearFirma,
    eliminarFirma,
    actualizarFirma,
    recargarFirmas: cargarFirmas,
  };
}
