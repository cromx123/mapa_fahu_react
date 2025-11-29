import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, FileText, ArrowRight, Compass, GraduationCap } from 'lucide-react';
import busca_leon from "../assets/leoncito/buscando_rutas.png";
import tramites_leon from "../assets/leoncito/buscando_tramites.png";

const USACH_ORANGE = "#E77500";
const USACH_TEAL = "#0d9488"; // Aproximación al teal-600 usado en tu header

export default function HomeSelectionScreen() {
  const navigate = useNavigate();
  const [activeSide, setActiveSide] = useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen w-full flex flex-row overflow-hidden font-sans items-stretch">
      
      {/* ================= SECCIÓN IZQUIERDA: MAPA USACH ================= */}
      <div 
        className="relative flex-1 h-full group cursor-pointer overflow-hidden transition-all duration-500 ease-in-out hover:flex-[1.2]"
        onMouseEnter={() => setActiveSide('left')}
        onMouseLeave={() => setActiveSide(null)}
        onClick={() => handleNavigation('/mapa')}
      >
        {/* Fondo con imagen/color */}
        <div className={`absolute inset-0 bg-teal-800 transition-transform duration-700
           ${activeSide === 'left' ? 'scale-110' : 'scale-100'}`}
        >
          <div
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        {/* Overlay oscuro al hacer hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300" />

        {/* Contenido Central */}
        {/* ⬇️ p-4 en mobile, p-8 en md+ para no pasarse de alto */}
        <div className="relative h-full flex flex-col items-center justify-center p-4 md:p-8 z-10 text-white">
          
          {/* León explorador con tamaño responsive */}
          <div className="mb-4 md:mb-6 transform transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-110">
            <img
              src={busca_leon}
              alt='León Del Mapa'
              className="w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 object-contain"
            />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 tracking-tight drop-shadow-lg text-center">
            Mapa Usach
          </h2>
          
          {/* En mobile el texto es más chico y con menos margen */}
          <p className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-teal-100 text-center max-w-md mb-4 md:mb-8 text-sm md:text-base">
            Encuentra tu sala, laboratorios y espacios comunes. <br/> El león explorador te guía por el campus.
          </p>

          <button 
            className="flex items-center gap-2 bg-white text-teal-800 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-teal-500/50"
            aria-label="Ir al Mapa Usach"
          >
            <Compass className="w-5 h-5 md:w-6 md:h-6" />
            <span>Explorar Campus</span>
          </button>
        </div>
      </div>


      {/* ================= SECCIÓN DERECHA: INTRANET / SOLICITUDES ================= */}
      <div 
        className="relative flex-1 h-full group cursor-pointer overflow-hidden transition-all duration-500 ease-in-out hover:flex-[1.2]"
        onMouseEnter={() => setActiveSide('right')}
        onMouseLeave={() => setActiveSide(null)}
        onClick={() => handleNavigation('/login')} 
      >
        <div 
          className={`absolute inset-0 transition-transform duration-700 
          ${activeSide === 'right' ? 'scale-110' : 'scale-100'}`}
          style={{ backgroundColor: USACH_ORANGE }}
        >
          <div
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage:
                'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 30px 30px'
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300" />

        <div className="relative h-full flex flex-col items-center justify-center p-4 md:p-8 z-10 text-white">
          
          <div className="mb-4 md:mb-6 transform transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-110">
            <img
              src={tramites_leon}
              alt='León administrativo'
              className="w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 object-contain"
            />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 tracking-tight drop-shadow-lg text-center">
            Intranet Usach
          </h2>

          <p className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-orange-100 text-center max-w-md mb-4 md:mb-8 text-sm md:text-base">
            Gestión de solicitudes, trámites y formularios. <br/> Agiliza tus procesos con rectoría.
          </p>

          <button 
            className="flex items-center gap-2 bg-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-orange-500/50"
            style={{ color: USACH_ORANGE }}
            aria-label="Ir a Intranet Usach"
          >
            <FileText className="w-5 h-5 md:w-6 md:h-6" />
            <span>Realizar Trámites</span>
          </button>
        </div>
      </div>

      {/* Badge superior centrado */}
      <div className="absolute top-3 md:top-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 rounded-full shadow-lg border border-gray-200">
          <h1 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-teal-600"/>
            Humanidades <span style={{color: USACH_ORANGE}}>360°</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
