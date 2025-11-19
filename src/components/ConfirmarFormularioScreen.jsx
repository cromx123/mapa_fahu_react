import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


export default function ConfirmarFormularioScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, base64LogoHeader, base64LogoFooter, ingreso } =
    location.state || {};

  const refPDF = useRef(null);

  if (!formData) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl font-bold">
        ⚠ No hay datos disponibles
      </div>
    );
  }

  const generarPDF = async () => {
    const input = refPDF.current;

    const canvas = await html2canvas(input, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Solicitud_CAE_${formData.nombre}.pdf`);
  };

  const opcionesMap = {
    "3ra_opcion_1req": "Cursar asignatura en 3ra. opción -1 req.",
    "reinc_titulacion": "Reincorporación titulación fuera de plazo",
    "3ra_opcion_sr": "Cursar asignatura en 3ra. opción S/R",
    "prorroga": "Prórroga fuera de plazo",
    "tutoria_r": "Cursar asignatura por tutoría (asig. R)",
    "retiro_temporal": "Retiro Temporal fuera de plazo",
    "sin_req": "Cursar asignatura c/s req. (R)",
    "ampliacion": "Ampliación fuera de plazo",
    "reincorporacion": "Reincorporación fuera de plazo",
    "otros": "Otros"
  };

  const API_URL = process.env.REACT_APP_API_DOS_BASE_URL;

  const onConfirm = async () => {
    if (!ingreso) {
      alert("No se encontró el número de ingreso. No se puede confirmar.");
      return;
    }

    try {
      // Obtener usuario logeado
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("No hay usuario autenticado.");
        return;
      }

      const res = await fetch(`${API_URL}/solicitudes/confirmar/formulario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ingreso: ingreso, user_rut: user.user_rut}),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error en la recepción de la solicitud:", data);
        return;
      }
      navigate("/solicitudes_screen", { replace: true });

    } catch (error) {
      console.error("Error al confirmar:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ←
        </button>
        Previsualización del Formulario
      </header>

      {/* FORMATO A4 EXACTO */}
      <div
        ref={refPDF}
        className="bg-white mx-auto p-[20mm]"
        style={{
          width: "210mm",
          minHeight: "297mm",
          fontFamily: "Arial, sans-serif",
          fontSize: "12pt",
          lineHeight: "1.25",
        }}
      >

        {/* Logo y título */}
        <div className="flex justify-between items-start mb-4">

          {/* LOGO IZQUIERDO */}
          <div>
            {base64LogoHeader && (
              <img
                src={base64LogoHeader}
                alt="Logo"
                style={{ height: "75px", objectFit: "contain" }}
              />
            )}
          </div>

          {/* INGRESO N° */}
          <div className="text-right text-[12pt] font-bold mt-2">
            Ingreso N° <span style={{ borderBottom: "1px solid #000" }}>{ingreso}</span>
          </div>

        </div>

        {/* TÍTULOS CENTRADOS */}
        <h1 className="text-center font-bold text-[14pt] mt-2">
          CARTA - SOLICITUD
        </h1>

        <h2 className="text-center font-bold text-[12pt] mb-6">
          CONCESIÓN ACADÉMICA EXCEPCIÓN (C.A.E.)
        </h2>

        {/* CAMPOS */}
        <p><strong>Fecha: </strong>
          <span style={{ borderBottom: "1px solid black" }}>{formData.fecha}</span>
        </p>

        <p className="mt-3"><strong>NOMBRE COMPLETO: </strong>
          <span style={{ borderBottom: "1px solid black" }}>{formData.nombre}</span>
        </p>

        <div className="flex gap-10 mt-3">
          <p><strong>C.I.: </strong>
            <span style={{ borderBottom: "1px solid black" }}>{formData.ci}</span>
          </p>

          <p><strong>FONO: </strong>
            <span style={{ borderBottom: "1px solid black" }}>{formData.fono}</span>
          </p>
        </div>

        <p className="mt-3"><strong>CARRERA: </strong>
          <span style={{ borderBottom: "1px solid black" }}>{formData.carrera}</span>
        </p>

        <p className="mt-3 mb-6"><strong>CORREO: </strong>
          <span style={{ borderBottom: "1px solid black" }}>{formData.correo}</span>
        </p>

        {/* DESTINATARIO */}
        <p className="mt-6"><strong>A:</strong> VICE-DECANO DE DOCENCIA FAHU</p>
        <p className="mt-1 mb-5">Sr. Saúl Contreras Palma</p>

        <p className="mb-2">Solicito su autorización para:</p>

        {/* OPCIONES */}
        <div className="ml-4 mb-6">
          {Object.values(opcionesMap).map((label, idx) => (
            <div key={idx} className="flex items-center mb-1 text-[11pt]">
              
              {/* Caja cuadrada */}
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  border: "1px solid black",
                  marginRight: "8px",
                }}
              >
                {opcionesMap[formData.sol_autorizacion] === label && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "black",
                    }}
                  />
                )}
              </div>

              {/* Texto a la derecha */}
              {label}
            </div>
          ))}
        </div>


        {/* FUNDAMENTACIÓN */}
        <p className="font-bold mb-2">Fundamentación:</p>

        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid black",
              height: "14px",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: "11pt" }}>
              {formData.fundamentacion.split("\n")[i] || ""}
            </span>
          </div>
        ))}

        {/* FIRMA */}
        <p className="font-bold mt-8">FIRMA:</p>

        <div
          style={{
            borderBottom: "1px solid black",
            height: "50px",
            width: "60%",
          }}
        >
          {formData.firma && (
            <img
              src={formData.firma}
              alt="firma"
              style={{ height: "100%", objectFit: "contain" }}
            />
          )}
        </div>

        {/* ADJUNTOS */}
        <p className="mt-8 font-bold mb-2">Adjunta antecedentes</p>

        <p>
          SI <span style={{ borderBottom: "1px solid black", width: "60px", display: "inline-block" }}>
            {formData.adjuntos.length > 0 ? "X" : ""}
          </span>
          &nbsp;&nbsp;&nbsp;
          NO <span style={{ borderBottom: "1px solid black", width: "60px", display: "inline-block" }}>
            {formData.adjuntos.length === 0 ? "X" : ""}
          </span>
        </p>

        {/* PIE */}
        <div className="mt-16 text-[10pt] text-gray-700 leading-tight">
          <p>UNIVERSIDAD DE SANTIAGO DE CHILE</p>
          <p>Av. Libertador Bernardo O´Higgins Nº3363 – Estación Central – Santiago – Chile</p>
          <p>www.usach.cl</p>
        </div>

        {base64LogoFooter && (
          <img
            src={base64LogoFooter}
            alt="footer-logo"
            style={{ height: "90px", marginTop: "20px" }}
          />
        )}

      </div>

      <div className="text-center mt-8">
        <button
          onClick={generarPDF}
          className="px-8 py-3 bg-[#009b9b] text-white font-bold rounded shadow"
        >
          Descargar PDF
        </button>
        <button
          onClick={() => navigate("/formulario_cae")}
          className="ml-4 px-8 py-3 bg-gray-500 text-white font-bold rounded shadow"
        >
          Editar Formulario
        </button>
        <button
          onClick={onConfirm}
          className="ml-4 px-8 py-3 bg-teal-600 text-white font-bold rounded shadow"
        >
          Confirmar y Enviar Solicitud
        </button>
      </div>
    </div>
  );
}
