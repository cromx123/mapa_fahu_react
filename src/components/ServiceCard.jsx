import React from "react";
import { MdChevronRight } from "react-icons/md"; // para la flecha
import {
  MdSchool,
  MdWorkOutline,
  MdEventAvailable,
  MdHelpCenter,
  MdContactSupport,
} from "react-icons/md"; // algunos íconos de ejemplo

// Puedes pasar icon como cualquier ReactNode (ej: <MdSchool />)
export default function ServiceCard({
  icon = <MdSchool />,
  title,
  description,
  color = "blue",
  onClick,
  route,
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-rose-100 text-rose-700",
    teal: "bg-teal-100 text-teal-700",
    indigo: "bg-indigo-100 text-indigo-700",
    cyan: "bg-cyan-100 text-cyan-700",
    amber: "bg-amber-100 text-amber-700",
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition mb-4"
    >
      <div className="flex items-center p-4">
        {/* Icono en círculo */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c}`}>
          {icon}
        </div>

        {/* Texto */}
        <div className="flex-1 ml-4">
          <div className="font-semibold text-gray-900">{title}</div>
          {description && (
            <div className="text-sm text-gray-500 mt-1">{description}</div>
          )}
        </div>

        {/* Chevron */}
        {(route || onClick) && (
          <MdChevronRight className="text-gray-400 text-2xl" />
        )}
      </div>
    </div>
  );
}
