import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale/LangContext"; // 1. 번역 훅 import!
import "../mobile-ui.css";

export default function AddNoticePage() {
  const { t } = useLang(); // 2. 번역 객체
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError(t.noticeTitleAndContentRequired || "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8090/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("등록 실패");

      alert(t.noticeRegistered || "공지사항이 등록되었습니다.");
      navigate("/"); // 홈으로 이동
    } catch (err) {
      setError(t.noticeServerError || "서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">{t.addNoticeTitle || "공지사항 등록"}</h1>
      <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
        <input
          className="input"
          placeholder={t.noticeInputTitle || "제목을 입력하세요"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder={t.noticeInputContent || "내용을 입력하세요"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{ resize: "none" }}
        />
        {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
        <button type="submit" className="btn-primary">
          {t.noticeSubmit || "등록하기"}
        </button>
      </form>
    </div>
  );
}
