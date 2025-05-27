import React, { useEffect, useState } from "react";
import "../styles/LostRequestListPage.css";
import placeholderImg from "../pages/assets/empty.png";
import { useLang } from "../locale/LangContext";

export default function LostRequestListPage() {
  const { t } = useLang();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
=======
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc"); // 🔥 정렬 추가!
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);
>>>>>>> f59e03b (수정본2)

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

<<<<<<< HEAD
  if (loading) return <p className="loading-text">{t.loading || "⏳ 로딩 중..."}</p>;
  if (error) return <p className="error-text">{t.error || "에러"}: {error}</p>;
=======
  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`http://localhost:8090/api/lost-requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert("삭제되었습니다.");
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert("에러: " + err.message);
    }
  };

  // 🔥 제목+설명+장소 검색으로 개선 (원하면!)
  const filtered = requests.filter(
    (req) =>
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.description.toLowerCase().includes(search.toLowerCase()) ||
      req.location.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 최신순/오래된순 정렬!
  const sorted = filtered.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p className="loading-text">⏳ 로딩 중...</p>;
  if (error) return <p className="error-text">에러: {error}</p>;
>>>>>>> f59e03b (수정본2)

  return (
    <div className="request-list-wrapper">
      <h2 className="request-list-title">{t.requestListTitle || "📮 물건을 찾아주세요!"}</h2>

<<<<<<< HEAD
      {requests.length === 0 ? (
        <p className="empty-text">{t.requestListEmpty || "요청된 게시글이 없습니다."}</p>
=======
      {/* 🔥 정렬 드롭다운 추가 */}
      <div style={{ textAlign: "center", margin: "12px 0" }}>
        <select
          value={order}
          onChange={e => setOrder(e.target.value)}
          style={{
            padding: "7px 18px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "0.97rem",
            marginBottom: "8px",
            marginRight: "8px"
          }}
        >
          <option value="desc">📅 최신순</option>
          <option value="asc">📆 오래된순</option>
        </select>
        <input
          type="text"
          placeholder="제목으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "64%",
            padding: "10px 16px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "0.95rem",
            marginBottom: "20px",
          }}
        />
      </div>

      {paginated.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>검색 결과가 없습니다.</p>
>>>>>>> f59e03b (수정본2)
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
