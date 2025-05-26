import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function MessageSendPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const receiver_id = params.get("to");

  const [senderId, setSenderId] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSenderId(user.student_id);
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSend = async () => {
    if (!content.trim()) {
      setError("내용을 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8090/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: senderId, receiver_id, content }),
      });

      if (!res.ok) throw new Error("전송 실패");

      alert("쪽지가 전송되었습니다.");
      navigate(-1);
    } catch (e) {
      setError("전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "auto", padding: "24px" }}>
      <h2 style={{ color: "#d19c66", marginBottom: "16px" }}>📬 쪽지 보내기</h2>

      <p><strong>받는 사람 학번:</strong> {receiver_id}</p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="쪽지 내용을 입력하세요..."
        rows={6}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "none",
          marginTop: "12px",
          marginBottom: "8px"
        }}
      />

      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

      <button
        onClick={handleSend}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#d19c66",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "12px"
        }}
      >
        전송하기
      </button>
    </div>
  );
}
