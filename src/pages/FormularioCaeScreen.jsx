import React, { useState } from "react";

export default function FormularioCaeScreen({ goBack, goTo, setFormData }) {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    correo: "",
    carrera: "",
    telefono: "",
    motivo: "",
  });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (setFormData) setFormData(form);
    if (goTo) goTo("confirmar-formulario");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button className="mb-4 px-3 py-2 rounded bg-slate-800 text-white" onClick={goBack}>⬅ Volver</button>
      <h1 className="text-xl font-bold mb-4">Formulario CAE</h1>

      <form onSubmit={submit} className="grid gap-3">
        <input className="input" name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={onChange} required />
        <input className="input" name="rut" placeholder="RUT (sin puntos, con guion)" value={form.rut} onChange={onChange} required />
        <input className="input" type="email" name="correo" placeholder="Correo" value={form.correo} onChange={onChange} required />
        <input className="input" name="carrera" placeholder="Carrera" value={form.carrera} onChange={onChange} />
        <input className="input" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={onChange} />
        <textarea className="input min-h-28" name="motivo" placeholder="Motivo de la solicitud" value={form.motivo} onChange={onChange} />
        <div className="flex gap-2">
          <button type="button" className="px-3 py-2 rounded bg-slate-200" onClick={goBack}>Cancelar</button>
          <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">Confirmar</button>
        </div>
      </form>
    </div>
  );
}
