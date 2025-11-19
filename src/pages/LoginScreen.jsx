import React, { useState } from "react";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export default function LoginScreen({ goBack, onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      let ok = true, token = null;
      if (BASE_URL) {
        const r = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, pass }),
        });
        ok = r.ok;
        if (ok) token = (await r.json())?.token;
      }
      if (!ok) throw new Error("Credenciales inválidas");
      onLogin?.(token);
      alert("Sesión iniciada");
      goBack?.();
    } catch (e) {
      alert(e.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <button className="mb-4 px-3 py-2 rounded bg-slate-800 text-white" onClick={goBack}>⬅ Volver</button>
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <div className="grid gap-3">
        <input className="input" placeholder="Usuario" value={user} onChange={(e) => setUser(e.target.value)} />
        <input className="input" type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={login} disabled={loading || !user || !pass}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}
