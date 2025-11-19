// src/hooks/useAuth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, clave) => {
    setLoading(true);

    // helper para convertir cualquier "detail" en string
    const normalizeDetail = (detailRaw) => {
      if (!detailRaw) return "Error en login";

      // si viene como { detail: ... } lo desenrollamos
      const detail = detailRaw.detail ?? detailRaw;

      if (typeof detail === "string") return detail;

      
      if (Array.isArray(detail)) {
        const first = detail[0];
        if (first?.msg) return first.msg;
        return JSON.stringify(detail);
      }

      // FastAPI/Pydantic v2: detail = { type, loc, msg, input }
      if (detail.msg) return detail.msg;

      return JSON.stringify(detail);
    };

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_correo: email, user_clave: clave }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.status === 403) {
        localStorage.setItem(
          "user_pending",
          JSON.stringify({
            user_rut: data.rut,
            user_correo: email,
          })
        );

        return {
          error: normalizeDetail(data),
          redirectVerify: true,
        };
      }

      if (!res.ok) {
        return { error: normalizeDetail(data) };
      }

      localStorage.setItem("user", JSON.stringify(data));

      // Redirecciones según tipo de usuario
      if (data.tipousuario_id === 1) {
        navigate("/home-alumno");
      } else if (data.tipousuario_id === 2) {
        navigate("/panel-admin");
      } else if (data.tipousuario_id === 3) {
        navigate("/panel-analista");
      } else {
        // fallback
        navigate("/solicitudes_screen");
      }

      return { success: true };
    } catch (err) {
      setLoading(false);
      return { error: "No se pudo conectar con el servidor" };
    }
  };

  return { login, loading };
}
