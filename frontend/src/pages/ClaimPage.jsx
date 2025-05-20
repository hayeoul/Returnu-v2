import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../locale/LangContext"; // 1. 번역 훅 import!

export default function ClaimPage() {
  const { t } = useLang(); // 2. 번역 객체 사용
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert(t.claimInputNameAlert || "이름을 입력해주세요.");

    try {
      const res = await fetch(`http://localhost:8090/api/lost-items/claim/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claimed_by: name }),
      });

      if (!res.ok) throw new Error(t.claimServerError || "서버 오류 발생");

      alert(t.claimSuccess || "✅ 수령 처리가 완료되었습니다.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className="title">{t.claimTitle || "수령자 정보 입력"}</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder={t.claimInputName || "본인 이름 입력"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">
          {t.claimBtn || "✅ 수령 처리하기"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
}
