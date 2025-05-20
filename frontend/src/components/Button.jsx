// src/components/Button.jsx
import React from "react";
import "./Button.css";

export default function Button({
  variant = "primary",  // "primary" | "secondary"
  children,
  ...props            // onClick, type, disabled 등
}) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}
