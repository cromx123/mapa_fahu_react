import React from "react";
import AppHeader from "../components/AppHeader";

export default function MenuScreen({ goTo }) {
  const Item = ({ icon, text, onClick }) => (
    <button className="menu-item" onClick={onClick}>
      <span className="mi-icon">{icon}</span>
      <span className="mi-text">{text}</span>
      <span className="mi-right">›</span>
    </button>
  );
  return (
    <div className="screen">
      <AppHeader title="Menú" onBack={() => goTo("mapa")} />
      <div className="menu-list">
        <Item icon="🔑" text="Iniciar sesión" onClick={() => goTo("login")} />
        <Item icon="🎓" text="Portal USACH" onClick={() => window.open("https://www.usach.cl", "_blank")} />
        <Item icon="🖥️" text="Portal FaHu" onClick={() => window.open("https://fahu.usach.cl", "_blank")} />
        <Item icon="🖥️" text="Servicios en Línea" onClick={() => goTo("servicios")} />
        <Item icon="📚" text="Biblioteca en Línea" onClick={() => window.open("https://biblioteca.usach.cl", "_blank")} />
        <Item icon="⚙️" text="Configuración" onClick={() => goTo("config")} />
        <Item icon="ℹ️" text="Ayuda e información" onClick={() => alert("Ayuda")} />
      </div>
      <div className="menu-version">Solutions maps & FaHu<br/>1.0.3</div>
    </div>
  );
}
