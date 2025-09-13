// src/context/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import es from "../l10n/app_es.json";
import en from "../l10n/app_en.json";

function cleanJSON(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!k.startsWith("@")) out[k] = v;
  }
  return out;
}

const AppSettingsContext = createContext();

export function AppSettingsProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem("locale") || "es");
  const [unit, setUnit] = useState(() => localStorage.getItem("unit") || "meters");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem("unit", unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const translations = {
    es: cleanJSON(es),
    en: cleanJSON(en),
  };

  const t = (key) => translations[locale]?.[key] || key;

  return (
    <AppSettingsContext.Provider value={{ locale, setLocale, t, unit, setUnit, theme, setTheme }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
