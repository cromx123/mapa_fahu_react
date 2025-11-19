import React, { useState, useEffect } from "react";
import AppHeader from "../components/AppHeader";
import ToggleSwitch from "../components/ToggleSwitch";

export default function ConfigScreen({ goBack, setLocale, setUnit, setTheme }) {
  const [locale, _setLocale] = useState(localStorage.getItem("locale") || "es");
  const [unit, _setUnit] = useState(localStorage.getItem("unit") || "metros");
  const [notif, setNotif] = useState(JSON.parse(localStorage.getItem("notif") || "true"));
  const [theme, _setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => { localStorage.setItem("locale", locale); setLocale?.(locale); }, [locale, setLocale]);
  useEffect(() => { localStorage.setItem("unit", unit); setUnit?.(unit); }, [unit, setUnit]);
  useEffect(() => { localStorage.setItem("notif", JSON.stringify(notif)); }, [notif]);
  useEffect(() => { localStorage.setItem("theme", theme); setTheme?.(theme); }, [theme, setTheme]);

  const Item = ({ icon, title, subtitle, right, onClick }) => (
    <button className="list-item" onClick={onClick}>
      <div className="li-icon">{icon}</div>
      <div className="li-text">
        <div className="li-title">{title}</div>
        {subtitle && <div className="li-sub">{subtitle}</div>}
      </div>
      <div className="li-right">{right ?? <span className="chev">›</span>}</div>
    </button>
  );

  return (
    <div className="screen">
      <AppHeader title="Configuración" onBack={goBack} />

      <div className="list">
        <Item
          icon="🌐"
          title="Idioma"
          subtitle={locale === "es" ? "Español" : "English"}
          onClick={() => _setLocale(locale === "es" ? "en" : "es")}
        />
        <Item
          icon="🎨"
          title="Tema"
          subtitle={theme === "light" ? "Claro" : theme === "dark" ? "Oscuro" : "Sistema"}
          onClick={() => _setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
        />
        <Item
          icon="🔔"
          title="Notificaciones"
          right={<ToggleSwitch checked={notif} onChange={setNotif} />}
        />
        <Item
          icon="💾"
          title="Trayectos Guardados"
          onClick={() => alert("Abrir trayectos guardados")}
        />
        <Item
          icon="📏"
          title="Unidad de Medida"
          subtitle={unit === "metros" ? "Metros" : "Millas"}
          onClick={() => _setUnit(unit === "metros" ? "millas" : "metros")}
        />
        <Item
          icon="❓"
          title="Ayuda y Soporte"
          onClick={() => alert("Abrir ayuda")}
        />
      </div>
    </div>
  );
}
