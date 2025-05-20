import React, { useState } from "react";
import { useLang } from "../locale/LangContext"; // 언어 상태 관리 훅

const LANGUAGES = [
  { code: "ko", label: "한국어", icon: "🇰🇷" },
  { code: "en", label: "English", icon: "🇺🇸" }
];

export default function LanguageSelector({ darkMode }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.code === lang);

  return (
    <div
      className={`lang-selector${darkMode ? " dark" : ""}`}
      style={{
        position: "relative",
        display: "inline-block",
        minWidth: 80,
        zIndex: 100
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="lang-btn"
        style={{
          background: "none",
          border: "none",
          color: darkMode ? "#fff" : "#222",
          fontWeight: "bold",
          fontSize: "1.09rem",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: 4,
          padding: "6px 12px",
          borderRadius: 8
        }}
      >
        <span style={{ fontSize: "1.3em" }}>{current.icon}</span>
        <span style={{ margin: "0 4px 0 2px" }}>{current.label}</span>
        <span style={{ fontSize: 12, marginLeft: 3 }}>▼</span>
      </button>
      {open && (
        <div
          className="lang-dropdown"
          style={{
            position: "absolute",
            top: 36,
            left: 0,
            background: darkMode ? "#222" : "#fff",
            border: darkMode ? "1.5px solid #444" : "1.5px solid #d0d0d0",
            borderRadius: 8,
            boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
            minWidth: 120,
            overflow: "hidden"
          }}
        >
          {LANGUAGES.map(opt => (
            <button
              key={opt.code}
              onClick={() => { setLang(opt.code); setOpen(false); }}
              className="lang-opt"
              style={{
                width: "100%",
                background: opt.code === lang
                  ? (darkMode ? "#444" : "#e3f2fd")
                  : "none",
                color: darkMode ? "#fff" : "#222",
                padding: "9px 18px",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: opt.code === lang ? "bold" : "normal",
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: "1rem"
              }}
            >
              <span style={{ fontSize: "1.3em" }}>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
