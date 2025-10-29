import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CampusMapScreen from "./components/CampusMapScreen";
import ConfigScreen from "./components/ConfigScreen";
import LoginScreen from "./components/LoginScreen";
import ServiciosScreen from "./components/ServiciosScreen";
import ConvocatoriasScreen from "./components/ConvocatoriasScreen";
import SolicitudesScreen from "./components/SolicitudesScreen";
import FormularioCAEScreen from "./components/FormularioCaeScreen";
import ConfirmarFormScreen from "./components/ConfirmarFormularioScreen";
import SugerenciasScreen from "./components/FeedbackScreen";
import EstadosSolicitudesScreen from "./components/EstadoSolicitudScreen";

function App() {
  return (
    <Router>
      <Routes>
        {/* pantalla principal */}
        <Route path="/" element={<CampusMapScreen />} />

        {/* pantallas accesibles desde DrawerMenu */}
        <Route path="/config" element={<ConfigScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/servicios" element={<ServiciosScreen />} />
        <Route path="/convocatorias" element={<ConvocatoriasScreen />} />
        <Route path="/solicitudes_screen" element={<SolicitudesScreen/>} />
        <Route path="/formulario_cae" element={<FormularioCAEScreen/>} />
        <Route path="/confirmar_formulario" element={<ConfirmarFormScreen />} />
        <Route path="/sugerencias" element={<SugerenciasScreen/>} />
        <Route path="/estado_solicitud" element={<EstadosSolicitudesScreen/>} />
        <Route path="*" element={<h1>Página no encontrada</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
