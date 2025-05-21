import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FoundDetailPage.css";

export default function FoundDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [claimedName, setClaimedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`http://localhost:8090/api/lost-items/${id}`);
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleClaim = async () => {
    if (!claimedName.trim()) {
      alert("수령자 이름을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8090/api/lost-items/claim/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimed_by: claimedName }),
      });
      if (!res.ok) throw new Error("수령 처리 실패");
      alert("수령 처리가 완료되었습니다.");
      window.location.reload();
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  return (
    <div className="found-detail-wrapper">

      {/* 🔙 상단 왼쪽 뒤로가기 */}
      <div style={{
        position: "relative",
        width: "100%",
        padding: "12px 16px 0",
        boxSizing: "border-box"
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          ← 뒤로가기
        </button>
      </div>

      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {item && (
        <div className="found-detail-card">
          {item.image ? (
            <img
              src={`http://localhost:8090${item.image}`}
              alt="분실물 이미지"
              className="found-detail-image"
            />
          ) : (
            <div className="found-detail-image" style={{ background: "#f5f5f5", textAlign: "center", lineHeight: "200px", color: "#aaa" }}>
              이미지 없음
            </div>
          )}

          <h2 className="found-detail-title">{item.title}</h2>
          <p className="found-detail-meta">📍 위치: {item.location}</p>
          <p className="found-detail-meta">🗓️ 습득일: {new Date(item.date).toLocaleDateString("ko-KR")}</p>

          {item.claimed_by && (
            <p className="found-detail-status">✅ 수령 완료: {item.claimed_by}</p>
          )}

          <p className="found-detail-description">{item.description}</p>
          <p className="found-detail-created">등록일: {new Date(item.created_at).toLocaleDateString("ko-KR")}</p>

          {/* 📌 보관 안내 */}
          <div style={{ marginTop: "20px", padding: "12px", border: "1px solid #eee", borderRadius: "8px", background: "#f9f9f9" }}>
            <p style={{ marginBottom: "8px" }}>📌 <strong>보관 장소:</strong> 학생지원센터 1층 분실물 창구</p>
            <p style={{ marginBottom: "8px" }}>
              ⏳ <strong>보관 기한:</strong>{" "}
              {new Date(new Date(item.created_at).getTime() + 14 * 86400000).toLocaleDateString("ko-KR")}
            </p>
            <p style={{ color: "#999", fontSize: "0.9rem" }}>📋 2주간 보관 후 폐기 예정입니다.</p>
          </div>

          {/* 관리자 수령 처리 */}
          {user?.role === "admin" && (
            <div className="found-detail-claim-input">
              <input
                type="text"
                placeholder="수령자 이름 입력"
                value={claimedName}
                onChange={(e) => setClaimedName(e.target.value)}
              />
              <button className="found-detail-claim-button" onClick={handleClaim}>
                수령 처리하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
