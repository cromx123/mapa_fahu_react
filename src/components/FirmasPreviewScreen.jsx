// src/components/FirmasScreen.jsx
import React, { useState } from "react";
import AsideMenu from "./AsideMenu";
import useFirmas from "../hooks/useFirmas";

export default function FirmasScreen() {
  const [accion, setAccion] = useState(null); // "agregar" | "modificar" | "eliminar" | null
  const pre_data = JSON.parse(localStorage.getItem("user"));
  const [nombreFirma, setNombreFirma] = useState("");
  const [archivoFirma, setArchivoFirma] = useState(null);
  const [previewFirma, setPreviewFirma] = useState(null);

  const [firmaSeleccionadaId, setFirmaSeleccionadaId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");

  const {
    firmas,
    loading,
    error,
    crearFirma,
    eliminarFirma,
    actualizarFirma,
  } = useFirmas();

  const onSelectAccion = (tipo) => {
    setAccion(tipo);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    setArchivoFirma(file || null);

    if (!file) {
      setPreviewFirma(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewFirma(ev.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmitAgregar = async (e) => {
    e.preventDefault();

    if (!nombreFirma.trim() || !archivoFirma) {
      alert("Debes ingresar un nombre y seleccionar un archivo PNG.");
      return;
    }

    try {
      await crearFirma(nombreFirma.trim(), archivoFirma);
      alert("Firma guardada correctamente ✅");
      setNombreFirma("");
      setArchivoFirma(null);
      setPreviewFirma(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al guardar la firma");
    }
  };

  const onSubmitModificar = async (e) => {
    e.preventDefault();
    if (!firmaSeleccionadaId) {
      alert("Selecciona una firma");
      return;
    }

    try {
      await actualizarFirma(firmaSeleccionadaId, nuevoNombre || undefined, archivoFirma || undefined);
      alert("Firma actualizada correctamente ✅");
      setNuevoNombre("");
      setArchivoFirma(null);
      setPreviewFirma(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al actualizar la firma");
    }
  };

  const onEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta firma?")) return;

    try {
      await eliminarFirma(id);
      alert("Firma eliminada correctamente ✅");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al eliminar la firma");
    }
  };

  const TIPOS_USUARIO = Object.freeze({
    1: "Estudiante",
    3: "Analista",
    2: "Administrador",
  });

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AsideMenu />

      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow">
            <div className="flex justify-between items-center">
              <span>Firmas</span>
              <div className="flex flex-col text-right leading-tight">
                <span className="font-semibold text-white">{pre_data.user_name}</span>
                <span className="text-sm text-gray-200">{TIPOS_USUARIO[pre_data.tipousuario_id]}</span>
              </div>
            </div>
          </header>

        {/* BODY */}
        <main className="flex-1 p-6 space-y-6">
          {/* Descripción general */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Gestión de firmas</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              En esta sección podrás administrar tus firmas digitales que se utilizan
              en las solicitudes y documentos de la plataforma.
            </p>
          </section>

          {/* Acciones principales */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Acciones disponibles</h2>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Agregar firma */}
              <button
                type="button"
                onClick={() => onSelectAccion("agregar")}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left transition
                  ${accion === "agregar" ? "ring-2 ring-teal-500" : ""}`}
              >
                <h3 className="font-semibold mb-2">Agregar firma</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Sube una nueva firma digital (por ejemplo, una imagen PNG) para
                  usarla en tus futuras solicitudes.
                </p>
                <span className="inline-block mt-1 text-sm font-semibold text-teal-600 dark:text-teal-400">
                  Abrir formulario →
                </span>
              </button>

              {/* Modificar firma */}
              <button
                type="button"
                onClick={() => onSelectAccion("modificar")}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left transition
                  ${accion === "modificar" ? "ring-2 ring-amber-500" : ""}`}
              >
                <h3 className="font-semibold mb-2">Modificar firma</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Actualiza una firma existente reemplazando la imagen o cambiando
                  su nombre identificador.
                </p>
                <span className="inline-block mt-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Abrir listado de firmas →
                </span>
              </button>

              {/* Eliminar firma */}
              <button
                type="button"
                onClick={() => onSelectAccion("eliminar")}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left transition
                  ${accion === "eliminar" ? "ring-2 ring-red-500" : ""}`}
              >
                <h3 className="font-semibold mb-2">Eliminar firma</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Elimina una firma que ya no necesites. Esta dejará de estar
                  disponible para nuevas solicitudes.
                </p>
                <span className="inline-block mt-1 text-sm font-semibold text-red-600 dark:text-red-400">
                  Abrir listado de firmas →
                </span>
              </button>
            </div>
          </section>

          {/* Estados hook */}
          {loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cargando firmas...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {/* FORMULARIO AGREGAR */}
          {accion === "agregar" && (
            <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Agregar nueva firma</h2>

              <form className="space-y-4" onSubmit={onSubmitAgregar}>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Nombre de la firma
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                    placeholder="Ej: Firma Gabo 2025"
                    value={nombreFirma}
                    onChange={(e) => setNombreFirma(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Archivo (PNG)
                  </label>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={onFileChange}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Recomendado: firma en fondo blanco o transparente.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Previsualización
                  </label>
                  <div className="border border-dashed border-gray-400 dark:border-gray-600 h-28 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    {previewFirma ? (
                      <img
                        src={previewFirma}
                        alt="Firma"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        No hay firma seleccionada
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700"
                  >
                    Guardar firma
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccion(null);
                      setNombreFirma("");
                      setArchivoFirma(null);
                      setPreviewFirma(null);
                    }}
                    className="px-5 py-2 rounded-md border text-sm dark:border-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* MODIFICAR */}
          {accion === "modificar" && (
            <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold mb-2">Modificar firma</h2>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Selecciona una firma
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                  value={firmaSeleccionadaId || ""}
                  onChange={(e) =>
                    setFirmaSeleccionadaId(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                >
                  <option value="">-- Selecciona --</option>
                  {firmas.map((f) => (
                    <option key={f.firma_id} value={f.firma_id}>
                      {f.firma_nombre} (#{f.firma_id})
                    </option>
                  ))}
                </select>
              </div>

              <form className="space-y-4" onSubmit={onSubmitModificar}>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Nuevo nombre (opcional)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Dejar en blanco para no cambiar el nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Nueva imagen PNG (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={onFileChange}
                    className="text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600"
                  >
                    Actualizar firma
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccion(null);
                      setFirmaSeleccionadaId(null);
                      setNuevoNombre("");
                      setArchivoFirma(null);
                      setPreviewFirma(null);
                    }}
                    className="px-5 py-2 rounded-md border text-sm dark:border-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ELIMINAR */}
          {accion === "eliminar" && (
            <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold mb-2">Eliminar firma</h2>
              {firmas.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No tienes firmas registradas.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {firmas.map((f) => (
                    <li
                      key={f.firma_id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">
                        #{f.firma_id} — {f.firma_nombre}
                      </span>
                      <button
                        type="button"
                        onClick={() => onEliminar(f.firma_id)}
                        className="px-3 py-1 rounded-md bg-red-600 text-white text-xs hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
