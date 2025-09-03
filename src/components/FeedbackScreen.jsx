import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ========== BottomSheet genérico ========== */
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* sheet */}
      <div className="relative w-full rounded-t-2xl bg-white shadow-xl p-4 pb-6 max-h-[85vh] overflow-auto animate-[slideUp_.18s_ease-out]">
        {title && (
          <div className="text-center text-gray-800 font-semibold mb-2">
            {title}
          </div>
        )}
        {children}
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(16px); opacity: .98 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

/* ========== Acordeón simple (FAQ) ========== */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100"
      >
        <span className="text-gray-800">{title}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 py-3 text-sm text-gray-700">{children}</div>}
    </div>
  );
}

/* ========== Pantalla principal ========== */
export default function SugerenciasScreen() {
  // i18n mínimo (sustituye por tu sistema real)
  const t = useMemo(
    () => ({
      cs_feedback: "Sugerencias",
      fs_feedbackThankYou: "¡Gracias por tu sugerencia!",
      fs_feedbackName: "Nombre",
      fs_feedbackNameRequired: "Por favor ingresa tu nombre",
      fs_feedbackEmail: "Email",
      fs_feedbackEmailRequired: "Por favor ingresa tu email",
      fs_feedbackEmailInvalid: "Email no válido",
      fs_feedbackMessage: "Mensaje",
      fs_feedbackMessageRequired: "Por favor ingresa tu mensaje",
      fs_feedbackMessageTooShort: "Mínimo 10 caracteres",
      fs_feedbackSubmit: "Enviar",
      fs_feedbackFrequentQuestions: "Preguntas frecuentes",
      fs_close: "Cerrar",
      fs_faqQuestion1: "¿Cómo se usa la app?",
      fs_faqAnswer1:
        "Puedes buscar salas/edificios, ver rutas y activar la navegación paso a paso.",
      fs_faqQuestion2: "¿Cómo reporto un error en el mapa?",
      fs_faqAnswer2:
        "Desde el menú de feedback envíanos el detalle (lugar, horario, captura).",
    }),
    []
  );

  // estado del form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // errores
  const [errors, setErrors] = useState({});
  const [faqOpen, setFaqOpen] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = t.fs_feedbackNameRequired;
    if (!email.trim()) next.email = t.fs_feedbackEmailRequired;
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(email.trim()))
      next.email = t.fs_feedbackEmailInvalid;
    if (!message.trim()) next.message = t.fs_feedbackMessageRequired;
    else if (message.trim().length < 10)
      next.message = t.fs_feedbackMessageTooShort;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // aquí enviarías al backend
    alert(t.fs_feedbackThankYou);
    // limpiar o navegar
    setName("");
    setEmail("");
    setMessage("");
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* AppBar */}
      <header className="px-4 py-3 bg-teal-700 text-white text-lg font-bold shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ← 
        </button>  {/*Cambiar el icono por <*/}
        {t.cs_feedback}
      </header>

      {/* Contenido */}
      <div className="flex-1 p-4">
        <form
          onSubmit={onSubmit}
          className="max-w-xl mx-auto bg-white rounded-xl shadow border p-4 space-y-4"
        >
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.fs_feedbackName}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">👤</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600"
                placeholder={t.fs_feedbackName}
              />
            </div>
            {errors.name && (
              <div className="mt-1 text-sm text-red-600">{errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.fs_feedbackEmail}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="nombre@dominio.com"
              />
            </div>
            {errors.email && (
              <div className="mt-1 text-sm text-red-600">{errors.email}</div>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.fs_feedbackMessage}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600"
              placeholder={t.fs_feedbackMessage}
            />
            {errors.message && (
              <div className="mt-1 text-sm text-red-600">{errors.message}</div>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-md px-4 py-2 bg-teal-600 text-white font-semibold hover:bg-teal-700"
            >
              {t.fs_feedbackSubmit}
            </button>
            <button
              type="button"
              onClick={() => setFaqOpen(true)}
              className="text-teal-700 hover:underline"
            >
              {t.fs_feedbackFrequentQuestions}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom sheet: Preguntas Frecuentes */}
      <BottomSheet
        open={faqOpen}
        onClose={() => setFaqOpen(false)}
        title={t.fs_feedbackFrequentQuestions}
      >
        <div className="space-y-3">
          <Accordion title={t.fs_faqQuestion1}>
            {t.fs_faqAnswer1}
          </Accordion>
          <Accordion title={t.fs_faqQuestion2}>
            {t.fs_faqAnswer2}
          </Accordion>

          <div className="pt-3 text-center">
            <button
              onClick={() => setFaqOpen(false)}
              className="rounded-md border px-4 py-2 hover:bg-gray-50"
            >
              {t.fs_close}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
