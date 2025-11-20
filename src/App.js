import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CampusMapScreen from "./components/CampusMapScreen";
import ConfigScreen from "./components/ConfigScreen";
import ConfigSolicitudesScreen from "./components/ConfigScreenSolicitudes";
import LoginScreen from "./components/LoginScreen";
import ServiciosScreen from "./components/ServiciosScreen";
import ConvocatoriasScreen from "./components/ConvocatoriasScreen";
import SolicitudesScreen from "./components/SolicitudesScreen";
import FormularioCAEScreen from "./components/FormularioCaeScreen";
import ConfirmarFormScreen from "./components/ConfirmarFormularioScreen";
import SugerenciasScreen from "./components/FeedbackScreen";
import EstadosSolicitudesScreen from "./components/EstadoSolicitudScreen";
import FavoritosScreen from "./components/FavoritosScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import VerificarCuenta from "./components/VerificarCuenta";
import AyudaSolicitudesScreen from "./components/AyudaSolicitudesScreen";
import FirmasPreviewScreen from "./components/FirmasPreviewScreen";
import PerfilUsuario from "./components/PerfilUsuario";

function App() {
  return (
    <Router>
      <Routes>
        {/* pantalla principal */}
        <Route path="/" element={<CampusMapScreen />} />

        {/* pantallas accesibles desde DrawerMenu */}
        <Route path="/config" element={<ConfigScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/verificar-cuenta" element={<VerificarCuenta />} />
        <Route path="/firmas" element={<FirmasPreviewScreen/>} />
        <Route path="/servicios" element={<ServiciosScreen />} />
        <Route path="/convocatorias" element={<ConvocatoriasScreen />} />
        <Route path="/favoritos" element={<FavoritosScreen/>}/>
        <Route path="/solicitudes_screen" element={<ProtectedRoute> <SolicitudesScreen/> </ProtectedRoute> }/>
        <Route path="/AyudaSolicitudesScreen" element={<ProtectedRoute> <AyudaSolicitudesScreen/> </ProtectedRoute> }/>
        <Route path="/config_solicitudes" element={<ProtectedRoute> <ConfigSolicitudesScreen/> </ProtectedRoute> } />
        <Route path="/formulario_cae" element={<ProtectedRoute> <FormularioCAEScreen/> </ProtectedRoute> } />
        <Route path="/perfil_usuario" element={<ProtectedRoute> <PerfilUsuario/> </ProtectedRoute> } />
        <Route path="/confirmar_formulario" element={<ProtectedRoute> <ConfirmarFormScreen/> </ProtectedRoute> } />
        <Route path="/sugerencias" element={<SugerenciasScreen/>} />
        <Route path="/estado_solicitud" element={<ProtectedRoute> <EstadosSolicitudesScreen/> </ProtectedRoute>} />
        <Route path="*" element={<h1>Página no encontrada</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
