// src/components/ServicesScreen.jsx
import React from "react";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../context/SettingsContext";

export default function ServicesScreen() {
  const navigate = useNavigate();
  const { t } = useAppSettings();

  const services = [
    {
      title: t("srv_assistantCalls"),
      subtitle: t("srv_assistantCallsSubtitle"),
      color: "blue",
      onClick: () => navigate("/convocatorias"),
      icon: "🧰",
    },
    {
      title: t("srv_academicPrograms"),
      subtitle: t("srv_academicProgramsSubtitle"),
      color: "green",
      onClick: () => alert("Academic Programs selected"),
      icon: "🎓",
    },
    {
      title: t("srv_academicCalendar"),
      subtitle: t("srv_academicCalendarSubtitle"),
      color: "orange",
      onClick: () => alert("Academic Calendar selected"),
      icon: "🗓️",
    },
    {
      title: t("srv_studentAdvising"),
      subtitle: t("srv_studentAdvisingSubtitle"),
      color: "purple",
      onClick: () => alert("Student Advising selected"),
      icon: "❓",
    },
    {
      title: t("srv_eventsActivities"),
      subtitle: t("srv_eventsActivitiesSubtitle"),
      color: "red",
      onClick: () => alert("Events selected"),
      icon: "📍",
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="px-4 py-3 bg-teal-600 text-white text-lg font-bold shadow dark:bg-teal-700">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl hover:text-gray-200"
        >
          ←
        </button>
        {t("srv_header")}
      </header>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {services.map((s) => (
          <ServiceCard
            key={s.title}
            icon={s.icon}
            title={s.title}
            description={s.subtitle}
            color={s.color}
            onClick={s.onClick}
          />
        ))}
      </div>
    </div>
  );
}
