// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale/LangContext"; // ⭐️ 번역 훅 임포트

export default function LoginPage() {
  const { t } = useLang(); // ⭐️ 번역 객체
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8090/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, password }),
      });

      if (!res.ok) throw new Error(t.loginFail || "로그인 실패");

      const { user } = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      alert(t.loginSuccess || "로그인 성공!");
      navigate("/my");
    } catch (err) {
      setError(t.loginError || "❌ 로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">{t.loginTitle || "🔐 로그인"}</h1>
      <form onSubmit={handleLogin} style={{ padding: "16px" }}>
        <input
          className="input"
          type="text"
          placeholder={t.loginIdPlaceholder || "학번 (숫자만)"}
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder={t.loginPwPlaceholder || "비밀번호"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">
          {t.loginBtn || "로그인"}
        </button>
        {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
      </form>
    </div>
  );
}
