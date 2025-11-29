// src/components/AsideMenu.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const USACH_ORANGE = "#E77500";

export default function AsideMenu({ onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("user"));
  const tipoUsuario = data.tipousuario_id;

  const onHandleCloseSession = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuUsers = [
    { name: "Solicitudes", path: "/solicitudes_screen" },
    { name: "Firmas", path: "/firmas" },
    { name: "Mapa del Campus", path: "/" },
    { name: "Perfil", path: "/perfil_usuario" },
    { name: "Configuración", path: "/config_solicitudes" },
    { name: "Ayuda", path: "/AyudaSolicitudesScreen" },
    { name: "Cerrar sesión", action: "logout" },
  ];

  const menuAdmin =[
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Administrar Usuarios", path: "/admin/users" },
    { name: "Administrar Solicitudes", path: "/admin/requests" },
    { name: "Administrar Settings", path: "/admin/settings" },
    { name: "Peticiones", path: "/admin/peticiones"}, // Manejemos las sugerencias, contactos o mensajes para cosas del mapa y de los formularios
  ];

  const menuAnalist =[
    { name: "Dashboard", path: "/analist/dashboard"},
    { name: "Gestion de Solicitudes", path :"/analist/solicitudes"}
  ];

  let menuItems = [...menuUsers];

  if (tipoUsuario === 2){
    menuItems = [...menuAdmin, ...menuUsers];
  }
  
  if (tipoUsuario === 3) {
    menuItems = [...menuAnalist, ...menuUsers];
  }

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="font-bold text-lg text-gray-800 dark:text-gray-100">
          <img
            src="https://fahu.usach.cl/site-assets/uploads/2023/06/Logo-FAHU-header.svg"
            alt="Facultad de Humanidades"
            className="w-60 h-auto p-2 dark:bg-white rounded-md" 
          />
        </div>
        <Menu
          className="md:hidden text-gray-600 dark:text-gray-300"
          onClick={onToggle}
        />
      </div>

      {/* MENU */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          if (item.action === "logout") {
            return (
              <button
                key="logout"
                onClick={onHandleCloseSession}
                className="block w-full text-left px-3 py-2 rounded-md font-medium
                          text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                🔒 {item.name}
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md font-medium transition ${
                active
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
