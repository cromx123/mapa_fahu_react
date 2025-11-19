import React, { useState } from "react";

export default function FotoScreen({ goBack }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const onPick = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview("");
    }
  };

  const subir = async () => {
    if (!file) return;
    // TODO: subir al backend si quieres
    alert("Imagen lista para subir ✅");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button className="mb-4 px-3 py-2 rounded bg-slate-800 text-white" onClick={goBack}>⬅ Volver</button>
      <h1 className="text-xl font-bold mb-4">Foto</h1>

      <input type="file" accept="image/*" onChange={onPick} className="mb-4" />
      {preview && <img src={preview} alt="preview" className="rounded-2xl border border-slate-200 max-h-72 object-contain" />}

      <div className="mt-3">
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={subir} disabled={!file}>
          Subir
        </button>
      </div>
    </div>
  );
}
