import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ============== BottomSheet genérico ============== */
function BottomSheet({ open, onClose, title, children }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[2000] flex items-end"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full rounded-t-2xl bg-white shadow-xl p-4 pb-6
                   max-h-[85vh] overflow-auto
                   animate-[slideUp_.18s_ease-out]"
      >
        {title && (
          <div className="text-center text-gray-800 font-semibold mb-2">
            {title}
          </div>
        )}
        {children}
      </div>

      {/* Animación simple */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: .98 }
          to   { transform: translateY(0);     opacity: 1 }
        }
      `}</style>
    </div>
  );
}

/* ============== Picker de Tema ============== */
function ThemePickerSheet({ open, onClose, value, onChange, t }) {
  const options = [
    { key: "light", label: t.cs_themeLight },
    { key: "dark", label: t.cs_themeDark },
    { key: "system", label: t.cs_themeSystem },
  ];

  return (
    <BottomSheet open={open} onClose={onClose} title={t.cs_theme}>
      <div className="divide-y">
        {options.map((opt) => {
          const selected = value === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => {
                onChange(opt.key);
                onClose();
              }}
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <span className="text-gray-800">{opt.label}</span>
              {selected && (
                <span className="text-blue-600 text-xl">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

/* ============== Cards tipo ServiceCard ============== */
function ConfigCard({ icon, color = "#2563eb", title, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex items-center p-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1 ml-4">
          <div className="font-semibold text-gray-800">{title}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
        <span className="text-gray-400 text-xl">{">"}</span>
      </div>
    </div>
  );
}

function ConfigSwitchCard({ icon, color = "#2563eb", title, subtitle, value, onChange }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border p-4 flex items-center">
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1 ml-4">
        <div className="font-semibold text-gray-800">{title}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-blue-600"
      />
    </div>
  );
}

/* ============== Pantalla Configuración ============== */
export default function ConfigScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState("es");
  const [theme, setTheme] = useState("light"); // light | dark | system
  const [notifications, setNotifications] = useState(false);
  const [events, setEvents] = useState(false);
  const [unit, setUnit] = useState("meters");

  const [showThemeSheet, setShowThemeSheet] = useState(false);

  const t = {
    cs_settingsTitle: "Configuración",
    cs_language: "Idioma",
    cs_languageSpanish: "Español",
    cs_languageEnglish: "Inglés",
    cs_theme: "Tema",
    cs_themeLight: "Claro",
    cs_themeDark: "Oscuro",
    cs_themeSystem: "Sistema (automático)",
    cs_notifications: "Notificaciones",
    cs_events: "Eventos",
    cs_eventsSubtitle: "Ver eventos en el mapa",
    cs_savedRoutes: "Trayectos Guardados",
    cs_units: "Unidad de Medida",
    cs_unitsMeters: "Metros",
    cs_unitsMiles: "Millas",
    cs_helpAndSupport: "Ayuda y Soporte",
    cs_feedback: "Sugerencias",
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <header className="flex items-center px-4 py-3 bg-teal-700 text-white shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ← 
        </button>  {/*Cambiar el icono por <*/}
        <h1 className="text-lg font-bold">{t.cs_settingsTitle}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <ConfigCard
          icon="🌐"
          color="#0ea5e9"
          title={t.cs_language}
          subtitle={locale === "es" ? t.cs_languageSpanish : t.cs_languageEnglish}
          onClick={() => setLocale(locale === "es" ? "en" : "es")}
        />

        <ConfigCard
          icon="🎨"
          color="#8b5cf6"
          title={t.cs_theme}
          subtitle={
            theme === "light" ? t.cs_themeLight :
            theme === "dark"  ? t.cs_themeDark  :
                                t.cs_themeSystem
          }
          onClick={() => setShowThemeSheet(true)}
        />

        <ConfigSwitchCard
          icon="🔔"
          color="#f59e0b"
          title={t.cs_notifications}
          value={notifications}
          onChange={setNotifications}
        />

        <ConfigSwitchCard
          icon="📅"
          color="#ef4444"
          title={t.cs_events}
          subtitle={t.cs_eventsSubtitle}
          value={events}
          onChange={setEvents}
        />

        <ConfigCard
          icon="💾"
          color="#06b6d4"
          title={t.cs_savedRoutes}
          onClick={() => alert("Ir a trayectos guardados")}
        />

        <ConfigCard
          icon="📏"
          color="#84cc16"
          title={t.cs_units}
          subtitle={unit === "meters" ? t.cs_unitsMeters : t.cs_unitsMiles}
          onClick={() => setUnit(unit === "meters" ? "miles" : "meters")}
        />

        <ConfigCard
          icon="❓"
          color="#22c55e"
          title={t.cs_helpAndSupport}
          onClick={() => alert("Ir a ayuda y soporte")}
        />

        <ConfigCard
          icon="💬"
          color="#ec4899"
          title={t.cs_feedback}
          onClick= {() => navigate("/sugerencias")}
        />
      </div>

      {/* Bottom Sheet para Tema */}
      <ThemePickerSheet
        open={showThemeSheet}
        onClose={() => setShowThemeSheet(false)}
        value={theme}
        onChange={setTheme}
        t={t}
      />
    </div>
  );
}
