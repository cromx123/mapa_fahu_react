// src/components/FeedbackScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../context/SettingsContext";

/* ========== Generic BottomSheet ========== */
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* sheet */}
      <div className="relative w-full rounded-t-2xl bg-white dark:bg-gray-800 shadow-xl p-4 pb-6 max-h-[85vh] overflow-auto animate-[slideUp_.18s_ease-out]">
        {title && (
          <div className="text-center text-gray-800 dark:text-gray-100 font-semibold mb-2">
            {title}
          </div>
        )}
        {children}
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: .98 }
          to   { transform: translateY(0);     opacity: 1 }
        }
      `}</style>
    </div>
  );
}

/* ========== Simple Accordion (FAQ) ========== */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        <span className="text-gray-800 dark:text-gray-100">{title}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
}

/* ========== Main Screen ========== */
export default function FeedbackScreen() {
  const { t } = useAppSettings(); // 🔑 importamos traducciones del contexto
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [faqOpen, setFaqOpen] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = t("fs_feedbackNameRequired");
    if (!email.trim()) next.email = t("fs_feedbackEmailRequired");
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(email.trim()))
      next.email = t("fs_feedbackEmailInvalid");
    if (!message.trim()) next.message = t("fs_feedbackMessageRequired");
    else if (message.trim().length < 10)
      next.message = t("fs_feedbackMessageTooShort");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert(t("fs_feedbackThankYou"));
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* AppBar */}
      <header className="px-4 py-3 bg-teal-700 text-white text-lg font-bold shadow">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ←
        </button>
        {t("cs_feedback")}
      </header>

      {/* Content */}
      <div className="flex-1 p-4">
        <form
          onSubmit={onSubmit}
          className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("fs_feedbackName")}
            </label>
            <div
              className={`flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700 ${
                errors.name
                  ? "border-rose-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <span className="text-gray-500">👤</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
                placeholder={t("fs_feedbackName")}
              />
            </div>
            {errors.name && (
              <div className="mt-1 text-sm text-red-600">{errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("fs_feedbackEmail")}
            </label>
            <div
              className={`flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700 ${
                errors.email
                  ? "border-rose-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <span className="text-gray-500">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
                placeholder="name@domain.com"
              />
            </div>
            {errors.email && (
              <div className="mt-1 text-sm text-red-600">{errors.email}</div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("fs_feedbackMessage")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full border rounded-md px-3 py-2 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-600"
              placeholder={t("fs_feedbackMessage")}
            />
            {errors.message && (
              <div className="mt-1 text-sm text-red-600">{errors.message}</div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-md px-4 py-2 bg-teal-600 text-white font-semibold hover:bg-teal-700"
            >
              {t("fs_feedbackSubmit")}
            </button>
            <button
              type="button"
              onClick={() => setFaqOpen(true)}
              className="text-teal-700 dark:text-teal-400 hover:underline"
            >
              {t("fs_feedbackFrequentQuestions")}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom sheet: FAQ */}
      <BottomSheet
        open={faqOpen}
        onClose={() => setFaqOpen(false)}
        title={t("fs_feedbackFrequentQuestions")}
      >
        <div className="space-y-3">
          <Accordion title={t("fs_faqQuestion1")}>{t("fs_faqAnswer1")}</Accordion>
          <Accordion title={t("fs_faqQuestion2")}>{t("fs_faqAnswer2")}</Accordion>

          <div className="pt-3 text-center">
            <button
              onClick={() => setFaqOpen(false)}
              className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t("fs_close")}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
