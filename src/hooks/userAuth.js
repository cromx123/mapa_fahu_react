// src/hooks/useAuth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (rut, clave) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_rut: rut, user_clave: clave }),
      });

      const data = await res.json();
      setLoading(false);

      // 🔥 CUENTA NO VERIFICADA
      if (res.status === 403) {
        localStorage.setItem("user_pending", JSON.stringify({
          user_rut: rut,
          user_correo: data.email || "" 
        }));

        return { error: data.detail, redirectVerify: true };
      }

      // ❌ ERROR NORMAL
      if (!res.ok) {
        return { error: data.detail || "Error en login" };
      }

      // ✔ LOGIN OK
      localStorage.setItem("user", JSON.stringify(data));

      if (data.tipousuario_id === 1) navigate("/home-alumno");
      if (data.tipousuario_id === 2) navigate("/panel-admin");
      if (data.tipousuario_id === 3) navigate("/panel-analista");

      return { success: true };

    } catch (err) {
      setLoading(false);
      return { error: "No se pudo conectar con el servidor" };
    }
  };

  return { login, loading };
}
