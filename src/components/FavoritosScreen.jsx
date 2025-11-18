import React, { useEffect, useState } from "react";
import FavoriteCard from "./FavoriteCard";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";

export default function FavoritosScreen() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  // 🔄 Cargar los favoritos guardados al montar el componente
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("favoritos") || "[]");
    setFavoritos(guardados);
  }, []);

  // 🗑️ Eliminar favorito
  const eliminarFavorito = (id) => {
    const actualizados = favoritos.filter((f) => f.id !== id);
    setFavoritos(actualizados);
    localStorage.setItem("favoritos", JSON.stringify(actualizados));
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* 🔹 Header */}
      <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ←
        </button>
        Favoritos
      </header>

      {/* 🔹 Lista de favoritos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {favoritos.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No tienes destinos guardados todavía.
          </p>
        ) : (
          favoritos.map((f) => (
            <div
              key={f.id}
              className="relative flex items-center justify-between bg-white rounded-xl shadow p-3 border border-gray-200 hover:shadow-md transition"
            >
                <FavoriteCard
                    icon={<Bookmark/>}
                    title={f.name}
                    description={
                        f?.type && f?.sector
                            ? `${f.type} del sector ${f.sector}`
                            : f?.type
                            ? `${f.type}`
                            : f?.sector
                                ? `Sector ${f.sector}`
                                : "sin descripción"
                    }
                    color="orange"
                    onClick={() => {
                    console.log("🗺️ Ir a:", f);
                    navigate("/mapa", { state: { destino: f } });
                    }}
                />
                
                {/* 🗑️ Botón eliminar */}
                <button
                    onClick={() => (eliminarFavorito(f.id), console.log(f))}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
                    title="Eliminar favorito"
                    
                    >
                    <Trash2 size={20} />
                </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
