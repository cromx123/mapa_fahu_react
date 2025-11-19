import React from "react";

export default function AppHeader({ title, onBack }) {
  return (
    <div className="app-header">
      <button className="back-btn" onClick={onBack} aria-label="Volver">←</button>
      <h1>{title}</h1>
    </div>
  );
}
