import { Navigate } from "react-router-dom";

export default function AnalistRoute({ children }) {
  const userString = localStorage.getItem("user");

  if (!userString) {
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(userString);
  const esAdmin = user.tipousuario_id === 3;

  if (!esAdmin) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}