import React, { useState, useEffect } from "react";
import "./selectbutton.css";


export default function SelectButton({ defaultValue = "domov", onChange }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handlePick = (val) => {
    setValue(val);
    onChange?.(val);
  };

  return (
    <div className="sb-wrap" role="tablist" aria-label="Výber typu produktu">
      <button
        role="tab"
        aria-selected={value === "domov"}
        className={`sb-btn ${value === "domov" ? "active" : ""}`}
        onClick={() => handlePick("domov")}
      >
        Domov/Byt
      </button>

      <span className="sb-divider" aria-hidden="true" />

      <button
        role="tab"
        aria-selected={value === "bytovka"}
        className={`sb-btn ${value === "bytovka" ? "active" : ""}`}
        onClick={() => handlePick("bytovka")}
      >
        Bytovka
      </button>
    </div>
  );
}
