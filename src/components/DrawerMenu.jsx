// src/components/DrawerMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DrawerMenu({ isOpen, onClose, t = (k) => k }) {
  
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex">
      {/* Overlay (clic para cerrar) */}
      <button
        className="flex-1 bg-black/40"
        onClick={onClose}
        aria-label="Cerrar menú"
      />

      {/* Panel lateral */}
      <aside className="w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col">
        {/* Encabezado */}
        <div className="h-24 flex items-center justify-center bg-teal-600 rounded-b-3xl">
          <h1 className="text-2xl font-bold text-orange-500">
            {t("ms_menuTitle") || "Menú"}
          </h1>
        </div>

        {/* Opciones */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <MenuItem
            label={t("ms_login") || "Iniciar sesión"}
            onClick={() => {
              navigate("/login");
              onClose();
            }}
          />
          <hr className="my-2" />
          <MenuItem
            label={t("ms_portalUsach") || "Portal USACH"}
            onClick={() => window.open("https://www.usach.cl/", "_blank")}
          />
          <MenuItem
            label={t("ms_portalFahu") || "Portal FAHU"}
            onClick={() => window.open("https://fahu.usach.cl/", "_blank")}
          />
          <MenuItem
            label={t("ms_portalAlumnos") || "Portal Alumnos"}
            onClick={() => window.open("https://registro.usach.cl/index.php", "_blank")}
          />
          <MenuItem
            label={t("ms_onlineServices") || "Servicios en línea"}
            onClick={() => {
              navigate("/servicios"); 
              onClose();
            }}
          />
          <MenuItem
            label={t("ms_onlineLibrary") || "Biblioteca en línea"}
            onClick={() => window.open("https://biblioteca.usach.cl/", "_blank")}
          />
          <MenuItem
            label={t("ms_settings") || "Configuración"}
            onClick={() => {
              navigate("/config"); 
              onClose();
            }}
          />
          <MenuItem label={"Ayuda e información"} disabled />
        </nav>

        {/* Pie */}
        <div className="p-3 text-center text-xs text-gray-500">
          Solutions maps & Fahu<br />1.0.3
        </div>
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
