import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LostListPage.css";
import emptyImage from "./assets/empty.png";
import { useLang } from "../locale/LangContext"; // 1. 번역 훅 import

export default function LostListPage() {
  const { t } = useLang(); // 2. 번역 객체
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("desc");
  const [status, setStatus] = useState("전체");

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const cat = queryParams.get("cat") || "전체";
  const user = JSON.parse(localStorage.getItem("user"));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t.locale || "ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short"
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.lostListConfirmDelete || "정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`http://localhost:8090/api/lost-items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t.lostListDeleteFail || "삭제 실패");
      alert(t.lostListDeleteSuccess || "삭제 완료!");
      window.location.reload();
    } catch (err) {
      alert((t.lostListDeleteError || "에러 발생: ") + err.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const catParam = cat === t.lostListAll || "전체" ? "" : `&cat=${encodeURIComponent(cat)}`;
        const statusParam = status === t.lostListAll || "전체" ? "" : `&status=${encodeURIComponent(status)}`;
        const url = `http://localhost:8090/api/lost-items/search?query=${encodeURIComponent(query)}${catParam}${statusParam}&order=${order}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(t.lostListFetchError || "목록을 불러올 수 없습니다.");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query, cat, order, status, t]);

  return (
    <div className="lost-list-wrapper">
      <h1 className="lost-list-title">{t.lostListTitle || "📦물건을 찾아가세요!"}</h1>

      <div className="lost-list-filters">
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">{t.lostListFilterNew || "📅 최신순"}</option>
          <option value="asc">{t.lostListFilterOld || "📆 오래된순"}</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="전체">{t.lostListAll || "📦 전체"}</option>
          <option value="미수령">{t.lostListUnclaimed || "📭 미수령"}</option>
          <option value="수령완료">{t.lostListClaimed || "✅ 수령완료"}</option>
        </select>
      </div>

      {loading && (
        <div className="spinner-container"><div className="spinner"></div></div>
      )}
      {error && <p className="lost-list-error">{error}</p>}

      {!loading && items.length === 0 && (
        <div className="lost-list-empty">
          <img src={emptyImage} alt={t.lostListNoResultImgAlt || "결과 없음"} />
          <p>{t.lostListNoResult || "검색 결과가 없습니다."}</p>
        </div>
      )}

      {!loading &&
        items.map((item) => (
          <div
            className={`lost-item-card ${item.claimed_by ? "claimed" : ""}`}
            key={item.id}
            onClick={() => navigate(`/found/${item.id}`)}
          >
            <div className="thumbnail-box">
              <img src={`http://localhost:8090${item.image}`} alt={t.lostListThumbAlt || "썸네일"} />
              {item.claimed_by && (
                <div className="claimed-badge">{t.lostListClaimed || "✅ 수령완료"}</div>
              )}
            </div>
            <div className="lost-item-body">
              <h3 className="lost-item-title">{item.title}</h3>
              <p className="meta">📍 {item.location}</p>
              <p className="meta">🗓 {formatDate(item.date)}</p>
            </div>
            {user?.role === "admin" && (
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
              >
                🗑 {t.lostListDeleteBtn || "삭제"}
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
