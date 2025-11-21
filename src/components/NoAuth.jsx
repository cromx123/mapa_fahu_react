import { useNavigate } from "react-router-dom"

export default function NoAuth(){
  const navigate = useNavigate()
  return(
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-red-600">
        No tienes autorización para acceder a esta sección
      </h1>
      <button
       onClick={() => navigate("/")}
       className=""
       >
        Volver al mapa
       </button>
    </div>
  )
}