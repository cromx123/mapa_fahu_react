import React from "react";

export default function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={`tgl ${checked ? "on" : ""}`}
      aria-pressed={checked}
      aria-label="Toggle"
    >
      <span className="knob" />
    </button>
  );
}
