// src/components/DrawerMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../context/SettingsContext";

export default function DrawerMenu({ isOpen, onClose }) {
  const { t } = useAppSettings();  // 👈 obtiene traductor
  const navigate = useNavigate();

  if (!isOpen) return null;

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="fixed inset-0 z-[5000] flex">
      <button className="flex-1 bg-black/40" onClick={onClose} aria-label="Cerrar menú" />
      <aside className="w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col">
        <div className="h-24 flex items-center justify-center bg-teal-600 rounded-b-3xl">
          <h1 className="text-2xl font-bold text-orange-500">
            {t("ms_menuTitle")}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {!user ? (
            <MenuItem 
              label={t("ms_login")} 
              onClick={() => { navigate("/login"); onClose(); }} 
            />
          ) : (
            <MenuItem 
              label="Ver solicitudes"
              onClick={() => { navigate("/solicitudes_screen"); onClose(); }} 
            />
          )}
          <hr className="my-2" />
          <MenuItem label={t("ms_portalUsach")} onClick={() => window.open("https://www.usach.cl/", "_blank")} />
          <MenuItem label={t("ms_portalFahu")} onClick={() => window.open("https://fahu.usach.cl/", "_blank")} />
          <MenuItem label={t("ms_portalAlumnos")} onClick={() => window.open("https://registro.usach.cl/index.php", "_blank")} />
          <MenuItem label={t("ms_onlineServices")} onClick={() => { navigate("/servicios"); onClose(); }} />
          <MenuItem label={t("ms_onlineLibrary")} onClick={() => window.open("https://biblioteca.usach.cl/", "_blank")} />
          <MenuItem label={t("ms_settings")} onClick={() => { navigate("/config"); onClose(); }} />
          <MenuItem label={"Ayuda e información"} disabled />
        </nav>
        <div className="p-3 text-center text-xs text-gray-500">Solutions maps & Fahu<br />1.0.3</div>
      </aside>
    </div>
  );
}


/** Componente interno para cada ítem del menú */
function MenuItem({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
}
