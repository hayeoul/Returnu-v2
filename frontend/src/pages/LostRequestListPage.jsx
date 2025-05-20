import React, { useEffect, useState } from "react";
import "../styles/LostRequestListPage.css";
import placeholderImg from "../pages/assets/empty.png";
import { useLang } from "../locale/LangContext";

export default function LostRequestListPage() {
  const { t } = useLang();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8090/api/lost-requests");
        if (!res.ok) throw new Error(t.requestListFetchError || "요청글을 불러올 수 없습니다.");
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t]);

  if (loading) return <p className="loading-text">{t.loading || "⏳ 로딩 중..."}</p>;
  if (error) return <p className="error-text">{t.error || "에러"}: {error}</p>;

  return (
    <div className="request-list-wrapper">
      <h2 className="request-list-title">{t.requestListTitle || "📮 물건을 찾아주세요!"}</h2>

      {requests.length === 0 ? (
        <p className="empty-text">{t.requestListEmpty || "요청된 게시글이 없습니다."}</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="request-card">
            <div className="request-thumb">
              <img
                src={req.image ? `http://localhost:8090${req.image}` : placeholderImg}
                alt={t.requestListImgAlt || "요청 이미지"}
              />
            </div>
            <div className="request-info">
              <h3>{req.title}</h3>
              <p><strong>📍</strong> {req.location}</p>
              <p><strong>📅</strong> {new Date(req.date).toLocaleDateString(t.locale || "ko-KR")}</p>
              <p className="desc">{req.description}</p>
              <p className="contact">
                {req.phone && <>📞 {req.phone}</>} {req.email && <>✉️ {req.email}</>}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
