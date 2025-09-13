// src/screens/ConfigScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../context/SettingsContext";

/* ============== BottomSheet genérico ============== */
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[2000] flex items-end"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Sheet */}
      <div
        className="relative w-full rounded-t-2xl bg-white dark:bg-[#1E1E1E] shadow-xl p-4 pb-6
                   max-h-[85vh] overflow-auto
                   animate-[slideUp_.18s_ease-out]"
      >
        {title && (
          <div className="text-center font-semibold mb-2 text-gray-800 dark:text-white">
            {title}
          </div>
        )}
        {children}
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: .98 }
          to   { transform: translateY(0);     opacity: 1 }
        }
      `}</style>
    </div>
  );
}

/* ============= Picker de Idioma ============= */
function LanguagePickerSheet({ open, onClose, value, onChange, t }) {
  const options = [
    { key: "es", label: t("cs_languageSpanish") },
    { key: "en", label: t("cs_languageEnglish") },
  ];

  return (
    <BottomSheet open={open} onClose={onClose} title={t("cs_language")}>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {options.map((opt) => {
          const selected = value === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => {
                onChange(opt.key);
                onClose();
              }}
              className="w-full text-left px-4 py-3 flex items-center justify-between 
                         hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
            >
              <span>{opt.label}</span>
              {selected && <span className="text-blue-600 text-xl">✓</span>}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

/* ============== Picker de Tema ============== */
function ThemePickerSheet({ open, onClose, value, onChange, t }) {
  const options = [
    { key: "light", label: t("cs_themeLight") },
    { key: "dark", label: t("cs_themeDark") },
    { key: "system", label: t("cs_themeSystem") },
  ];

  return (
    <BottomSheet open={open} onClose={onClose} title={t("cs_theme")}>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {options.map((opt) => {
          const selected = value === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => {
                onChange(opt.key);
                onClose();
              }}
              className="w-full text-left px-4 py-3 flex items-center justify-between 
                         hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
            >
              <span>{opt.label}</span>
              {selected && <span className="text-blue-600 text-xl">✓</span>}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

/* ============== Cards ============== */
function ConfigCard({ icon, color = "#2563eb", title, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-full rounded-xl shadow-sm border cursor-pointer transition
                 bg-white dark:bg-[#1E1E1E] hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1 ml-4">
          <div className="font-semibold text-gray-800 dark:text-white">{title}</div>
          {subtitle && <div className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</div>}
        </div>
        <span className="text-gray-400 dark:text-gray-500 text-xl">{">"}</span>
      </div>
    </div>
  );
}

function ConfigSwitchCard({
  icon,
  color = "#2563eb",
  title,
  subtitle,
  value,
  onChange,
}) {
  return (
    <div className="w-full rounded-xl shadow-sm border flex items-center
                    bg-white dark:bg-[#1E1E1E] p-4">
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1 ml-4">
        <div className="font-semibold text-gray-800 dark:text-white">{title}</div>
        {subtitle && <div className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</div>}
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-orange-500"
      />
    </div>
  );
}

/* ============== Pantalla Configuración ============== */
export default function ConfigScreen() {
  const navigate = useNavigate();
  const { locale, setLocale, t, unit, setUnit, theme, setTheme } = useAppSettings();

  const [notifications, setNotifications] = useState(false);
  const [events, setEvents] = useState(false);

  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-[#121212]">
      <header className="flex items-center px-4 py-3 bg-[#00A499] text-white shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ←
        </button>
        <h1 className="text-lg font-bold">{t("cs_settingsTitle")}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <ConfigCard
          icon="🌐"
          color="#0ea5e9"
          title={t("cs_language")}
          subtitle={locale === "es" ? t("cs_languageSpanish") : t("cs_languageEnglish")}
          onClick={() => setShowLanguageSheet(true)}
        />

        <ConfigCard
          icon="🎨"
          color="#8b5cf6"
          title={t("cs_theme")}
          subtitle={
            theme === "light"
              ? t("cs_themeLight")
              : theme === "dark"
              ? t("cs_themeDark")
              : t("cs_themeSystem")
          }
          onClick={() => setShowThemeSheet(true)}
        />

        <ConfigSwitchCard
          icon="🔔"
          color="#f59e0b"
          title={t("cs_notifications")}
          value={notifications}
          onChange={setNotifications}
        />

        <ConfigSwitchCard
          icon="📅"
          color="#ef4444"
          title={t("cs_events")}
          subtitle={t("cs_eventsSubtitle")}
          value={events}
          onChange={setEvents}
        />

        <ConfigCard
          icon="💾"
          color="#06b6d4"
          title={t("cs_savedRoutes")}
          onClick={() => alert("Ir a trayectos guardados")}
        />

        <ConfigCard
          icon="📏"
          color="#84cc16"
          title={t("cs_units")}
          subtitle={unit === "meters" ? t("cs_unitsMeters") : t("cs_unitsMiles")}
          onClick={() => setUnit(unit === "meters" ? "miles" : "meters")}
        />

        <ConfigCard
          icon="❓"
          color="#22c55e"
          title={t("cs_helpAndSupport")}
          onClick={() => alert("Ir a ayuda y soporte")}
        />

        <ConfigCard
          icon="💬"
          color="#ec4899"
          title={t("cs_feedback")}
          onClick={() => navigate("/sugerencias")}
        />
      </div>

      {/* Bottom Sheets */}
      <ThemePickerSheet
        open={showThemeSheet}
        onClose={() => setShowThemeSheet(false)}
        value={theme}
        onChange={setTheme}
        t={t}
      />
      <LanguagePickerSheet
        open={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        value={locale}
        onChange={setLocale}
        t={t}
      />
    </div>
  );
}
