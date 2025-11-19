import React from "react";
import { MdChevronRight } from "react-icons/md"; 
import { MdSchool } from "react-icons/md"; 
import { useAppSettings } from "../context/SettingsContext";

// Puedes pasar icon como cualquier ReactNode (ej: <MdSchool />)
export default function ServiceCard({
  icon = <MdSchool />,
  title,
  description,
  color = "blue",
  onClick,
  route,
}) {
  const { theme } = useAppSettings();
  const isDark = theme === "dark";

  const colorMap = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    red: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`w-full rounded-xl shadow-sm border cursor-pointer transition mb-4 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-0 bg-white hover:bg-gray-100`}
    >
      <div className="flex items-center p-4">
        {/* Icono en círculo */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c}`}>
          {icon}
        </div>

        {/* Texto */}
        <div className="flex-1 ml-4">
          <div className={`font-semibold text-gray-900 dark:text-white`}>
            {title}
          </div>
          {description && (
            <div className={`text-sm mt-1 text-gray-500 dark:text-gray-300`}>
              {description}
            </div>
          )}
        </div>

        {/* Chevron */}
        {(route || onClick) && (
          <MdChevronRight className={`text-2xl text-gray-400 dark:text-gray-400`} />
        )}
      </div>
    </div>
  );
}
