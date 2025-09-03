import React from "react";

export function ConfigCard({ icon, color = "#2563eb", title, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex items-center p-4">
        {/* Icono circular */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <span className="text-xl">{icon}</span>
        </div>

        {/* Texto */}
        <div className="flex-1 ml-4">
          <div className="font-semibold text-gray-800">{title}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>

        {/* Flecha */}
        {onClick && (
          <span className="text-gray-400 text-xl">{">"}</span>
        )}
      </div>
    </div>
  );
}

export function ConfigSwitchCard({ icon, color = "#2563eb", title, subtitle, value, onChange }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border p-4 flex items-center">
      {/* Icono circular */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <span className="text-xl">{icon}</span>
      </div>

      {/* Texto */}
      <div className="flex-1 ml-4">
        <div className="font-semibold text-gray-800">{title}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      </div>

      {/* Switch */}
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-blue-600"
      />
    </div>
  );
}
