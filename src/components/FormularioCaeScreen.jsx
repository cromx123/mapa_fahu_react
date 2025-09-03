// src/components/FormularioCaeScreen.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FormularioCaeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  // Logos recibidos desde navigate(..., { state: { logoHeader, logoFooter } })
  const base64LogoHeader = location?.state?.logoHeader || "";
  const base64LogoFooter = location?.state?.logoFooter || "";

  // Form state
  const [fecha, setFecha] = useState("");
  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [fono, setFono] = useState("");
  const [carrera, setCarrera] = useState("");
  const [correo, setCorreo] = useState("");
  const [fundamentacion, setFundamentacion] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [firmaPreview, setFirmaPreview] = useState(null);
  const [adjSi, setAdjSi] = useState(null); // true/false
  const [adjuntos, setAdjuntos] = useState([]);

  const opcionesLista = useMemo(
    () => [
      { v: "3ra_opcion_1req", label: "Cursar asignatura en 3ra. opción −1 req." },
      { v: "reinc_titulacion", label: "Reincorporación titulación fuera de plazo" },
      { v: "3ra_opcion_sr", label: "Cursar asignatura en 3ra. opción S/R" },
      { v: "prorroga", label: "Prórroga fuera de plazo" },
      { v: "tutoria_r", label: "Cursar asignatura por tutoría (asig. R)" },
      { v: "retiro_temporal", label: "Retiro Temporal fuera de plazo" },
      { v: "sin_req", label: "Cursar asignatura c/s req. (R)" },
      { v: "ampliacion", label: "Ampliación fuera de plazo" },
      { v: "reincorporacion", label: "Reincorporación fuera de plazo" },
      { v: "otros", label: "Otros" },
    ],
    []
  );

  const toggleOpcion = (val) => {
    setOpciones((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const onFirmaChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFirmaPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setFirmaPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const onAdjuntosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAdjuntos(files);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Validaciones simples
    if (!fecha || !nombre || !ci || !fono || !carrera || !correo || !fundamentacion) {
      alert("Completa todos los campos requeridos.");
      return;
    }

    const formData = {
      fecha,
      nombre,
      ci,
      fono,
      carrera,
      correo,
      opciones,
      fundamentacion,
      firma: firmaPreview, // dataURL de la firma (si subieron)
      adjuntos: adjuntos.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    };

    // Simulación de envío
    alert("Solicitud enviada ✔️ (simulado)");

    // Navegar a confirmar, con datos y logos
    navigate("/confirmar_formulario", {
      state: {
        formData,
        base64LogoHeader,
        base64LogoFooter,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#2f2f2f]">
      {/* Página */}
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Encabezado */}
        <div className="border-t-[18px] border-[#009b9b] pt-6 pb-4 flex items-center gap-4">
          {base64LogoHeader ? (
            <img
              src={base64LogoHeader}
              alt="Logo superior"
              className="h-[65px] object-contain"
            />
          ) : (
            <div className="h-[65px]" />
          )}
        </div>

        {/* Títulos */}
        <h1 className="font-black text-[1.28rem] text-center mt-2">CARTA - SOLICITUD</h1>
        <h2 className="font-bold text-[0.92rem] text-center mt-1 mb-5">
          CONCESIÓN ACADÉMICA EXCEPCIÓN (C.A.E.)
        </h2>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="px-2 md:px-3">
          {/* Fecha */}
          <div className="mb-4">
            <label className="font-bold mr-2">Fecha:</label>
            <input
              type="date"
              className="border-b border-black outline-none bg-transparent w-[91%] max-w-full"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label className="font-bold mr-2">Nombre completo:</label>
            <input
              type="text"
              className="border-b border-black outline-none bg-transparent w-[78%] max-w-full"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* C.I. y Fono */}
          <div className="mb-4 flex flex-wrap items-center gap-6">
            <div>
              <label className="inline-block font-bold mr-2">C.I.:</label>
              <input
                type="text"
                className="border-b border-black outline-none bg-transparent w-40"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="inline-block font-bold mr-2">FONO:</label>
              <input
                type="text"
                className="border-b border-black outline-none bg-transparent w-52"
                value={fono}
                onChange={(e) => setFono(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Carrera */}
          <div className="mb-4">
            <label className="font-bold mr-2">Carrera:</label>
            <input
              type="text"
              className="border-b border-black outline-none bg-transparent w-[89%] max-w-full"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              required
            />
          </div>

          {/* Correo */}
          <div className="mb-5">
            <label className="font-bold mr-2">Correo:</label>
            <input
              type="email"
              className="border-b border-black outline-none bg-transparent w-[90%] max-w-full"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          {/* A: */}
          <p className="mt-3 mb-2">
            <strong>A:&nbsp;&nbsp;VICE-DECANO DE DOCENCIA&nbsp;FAHU</strong>
            <br />
          </p>

          <p className="mb-3">Solicito su autorización para:</p>

          {/* Tabla de opciones (2 col) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {opcionesLista.map((o, idx) => (
              <label
                key={o.v}
                className="border border-black px-2 py-1 text-[0.86rem] flex items-center"
              >
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4"
                  checked={opciones.includes(o.v)}
                  onChange={() => toggleOpcion(o.v)}
                />
                {o.label}
              </label>
            ))}
          </div>

          {/* Fundamentación */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Fundamentación</label>
            <textarea
              className="w-full min-h-[180px] border border-black p-2 resize-y"
              value={fundamentacion}
              onChange={(e) => setFundamentacion(e.target.value)}
              required
            />
          </div>

          {/* Firma */}
          <div className="mt-6">
            <label className="block font-bold">Firma (PNG)</label>
            <div className="border border-dashed border-black h-[110px] flex items-center justify-center text-[#999] text-sm mb-2 text-center">
              {firmaPreview ? (
                <img
                  src={firmaPreview}
                  alt="firma"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                "Previsualización firma"
              )}
            </div>
            <input
              type="file"
              accept="image/png"
              onChange={onFirmaChange}
            />
          </div>

          {/* Adjunta antecedentes */}
          <div className="mt-6">
            <div className="text-[0.96rem]">Adjunta antecedentes:</div>
            <div className="mt-2">
              <label className="mr-5">
                <input
                  type="radio"
                  name="adj"
                  className="mr-2"
                  checked={adjSi === true}
                  onChange={() => setAdjSi(true)}
                />
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="adj"
                  className="mr-2"
                  checked={adjSi === false}
                  onChange={() => setAdjSi(false)}
                />
                No
              </label>
            </div>

            {adjSi === true && (
              <div className="mt-3">
                <input
                  type="file"
                  accept=".doc,.docx,.pdf,.png"
                  multiple
                  onChange={onAdjuntosChange}
                />
                <div className="text-xs text-gray-600 mt-1">
                  (.doc, .docx, .pdf, .png)
                </div>
              </div>
            )}
          </div>

          {/* Enviar */}
          <button
            type="submit"
            className="mt-8 mb-12 px-6 py-3 rounded bg-[#009b9b] text-white font-bold uppercase"
          >
            Enviar
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[60%] text-[0.78rem] leading-tight text-[#666]">
              <p>UNIVERSIDAD DE SANTIAGO DE CHILE</p>
              <p>Av. Libertador Bernardo O'Higgins n°3363 Estación Central Santiago Chile</p>
              <p>
                <a href="https://www.usach.cl" className="text-inherit">
                  www.usach.cl
                </a>
              </p>
            </div>
            {base64LogoFooter ? (
              <img
                src={base64LogoFooter}
                alt="Logo pie de página"
                className="w-[40%] max-w-[260px] h-auto"
              />
            ) : (
              <div className="w-[40%] max-w-[260px] h-[90px]" />
            )}
          </div>
          <div className="h-[2px] bg-[#009b9b] my-0"></div>
          <div className="bg-[#222d34] text-[#1db2ab] font-bold px-6 py-2 text-[0.9rem] text-left">
            <span style={{ color: "#f47c20" }}>#</span>
            <span style={{ color: "#ffffff" }}>SOMOS</span>
            <span style={{ color: "#55c1b0" }}>USACH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
