import React, { createContext, useContext, useState } from "react";
import LOCALE from "./index";

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "ko"
  );

  // 언어 변경시 localStorage에도 저장
  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  // t: 번역용 함수
  const t = LOCALE[lang];

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

// 어디서든 쓸 수 있게 export
export function useLang() {
  return useContext(LangContext);
}
