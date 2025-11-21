import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

export default function BarraConFiltros({ data }) {
  const [months, setMonths] = useState(3);

  // Ordenar por fecha y cortar según filtro
  const filteredData = useMemo(() => {
    const sorted = [...data].sort((a, b) => new Date(a.name) - new Date(b.name));
    return sorted.slice(-months);
  }, [data, months]);

  return (
    <div className="m-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-auto">
      <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-200">
        Resultados últimos {months} meses
      </h4>

      {/* Botones de filtro */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setMonths(3)}
          className={`px-3 py-1 text-sm rounded-lg ${
            months === 3
              ? "bg-teal-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
          }`}
        >
          3 meses
        </button>
        <button
          onClick={() => setMonths(6)}
          className={`px-3 py-1 text-sm rounded-lg ${
            months === 6
              ? "bg-teal-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
          }`}
        >
          6 meses
        </button>
        <button
          onClick={() => setMonths(12)}
          className={`px-3 py-1 text-sm rounded-lg ${
            months === 12
              ? "bg-teal-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
          }`}
        >
          12 meses
        </button>
      </div>

      {/* Gráfico */}
      <BarChart width={400} height={250} data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </div>
  );
}