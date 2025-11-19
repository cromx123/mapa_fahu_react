// src/components/Drawer.jsx
import React from "react";

export default function Drawer({ open, onClose, onGo }) {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-[1000] w-[78%] max-w-[360px] bg-white
                        shadow-xl transition-transform duration-200
                        ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="bg-teal-600 text-white px-5 pt-7 pb-5 rounded-br-3xl">
          <div className="text-2xl font-bold">Menú</div>
        </div>

        <div className="p-3">
          <Item icon="🔑" text="Iniciar sesión"        onClick={() => onGo?.("login")} />
          <Item icon="🎓" text="Portal USACH"          onClick={() => window.open("https://www.usach.cl","_blank")} />
          <Item icon="🖥️" text="Portal FaHu"           onClick={() => window.open("https://fahu.usach.cl","_blank")} />
          <Item icon="🧑‍🎓" text="Portal Alumnos"      onClick={() => window.open("https://portalalumnos.usach.cl","_blank")} />
          <Item icon="🖥️" text="Servicios en Línea"   onClick={() => onGo?.("servicios")} />
          <Item icon="📚" text="Biblioteca en Línea"   onClick={() => window.open("https://biblioteca.usach.cl","_blank")} />
          <Item icon="⚙️" text="Configuración"         onClick={() => onGo?.("config")} />
          <Item icon="ℹ️" text="Ayuda e información"   onClick={() => onGo?.("ayuda")} />
        </div>

        <div className="px-3 py-2 text-center text-xs text-gray-500">
          Solutions maps & FaHu<br/>1.0.3
        </div>
      </div>

      {/* Backdrop */}
      <button
        onClick={onClose}
        className={`fixed inset-0 z-[900] bg-black/25 transition-opacity
                    ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-label="Cerrar menú"
      />
    </>
  );
}

function Item({ icon, text, onClick }) {
  return (
    <button
      className="w-full text-left flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3 mb-2 shadow-sm"
      onClick={onClick}
    >
      <span className="w-7 text-teal-600">{icon}</span>
      <span className="flex-1 text-gray-800">{text}</span>
      <span className="text-gray-400 text-lg">›</span>
    </button>
  );
}
