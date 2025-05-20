import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale/LangContext"; // 1. 다국어 훅

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.slice(0, 10);
};

export default function MyPage() {
  const { t } = useLang(); // 2. t로 텍스트 접근
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert(t.loginFail || "먼저 로그인해주세요.");
      navigate("/login");
      return;
    }
    const userData = JSON.parse(stored);
    setUser(userData);

    // 내 분실물 가져오기
    fetch(`http://localhost:8090/api/lost-items?userId=${userData.id}`)
      .then(res => res.json())
      .then(data => {
        setMyItems(data);
        setLoading(false);
      })
      .catch(err => {
        setMyItems([]);
        setLoading(false);
      });
  }, [navigate, t]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert(t.logout || "로그아웃되었습니다.");
    navigate("/");
  };

  const handleItemClick = (id) => {
    navigate(`/lost-items/${id}`);
  };

  // --- 메인 렌더링 ---
  return (
    <div style={wrapperStyle}>
      <h1 style={mainTitleStyle}>
        <span role="img" aria-label="me">👤</span> {t.myInfo || "내 정보"}
      </h1>

      {/* 프로필 박스 */}
      <section style={sectionStyle}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h2 style={sectionTitleStyle}>{t.profile || "내 프로필"}</h2>
          <button
            onClick={handleLogout}
            style={logoutBtnStyle}
          >
            {t.logout || "로그아웃"}
          </button>
        </div>
        <p>{t.name || "이름"}: {user?.name}</p>
        <p>{t.studentId || "학번"}: {user?.student_id}</p>
      </section>

      {/* 내 등록 내역 */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>{t.myLostItems || "내 등록 내역"}</h2>
        {loading ? (
          <p style={{ color: "#888" }}>{t.loading || "불러오는 중..."}</p>
        ) : myItems.length === 0 ? (
          <p style={{ color: "#888" }}>{t.empty || "아직 등록한 분실물이 없습니다."}</p>
        ) : (
          <div style={{ marginBottom: 10, color: "#0288d1", fontWeight: "bold" }}>
            {(t.countTotal ? t.countTotal(myItems.length) : `전체 ${myItems.length}건`)}
            <span style={{ color: "#bbb", fontWeight: 400, marginLeft: 12 }}>
              {(t.recent ? t.recent(formatDate(myItems[0]?.date)) : `최근: ${formatDate(myItems[0]?.date)}`)}
            </span>
          </div>
        )}

        {/* 카드 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {myItems.map(item => (
            <div
              key={item.id}
              style={{
                ...itemCardStyle,
                display: "flex",
                alignItems: "center",
                transition: "transform 0.16s, box-shadow 0.16s"
              }}
              className="item-card"
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 4px 16px #cfd8dc";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = itemCardStyle.boxShadow;
              }}
            >
              {/* 썸네일 */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={t.itemImageAlt || "분실물"}
                  style={thumbStyle}
                />
              ) : (
                <div style={emptyThumbStyle}>📦</div>
              )}

              {/* 카드 본문 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "1.08rem", marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: "#444" }}>{item.description}</div>
                <div style={{ fontSize: 13, color: "#90caf9", marginTop: 2 }}>
                  {t.itemLocation || "위치"}: {item.location}
                </div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 5 }}>
                  {t.itemRegDate || "등록일"}: {formatDate(item.date)}
                  {/* 상태 뱃지 */}
                  {item.claimed_by ? (
                    <span style={badgeDone}>{t.itemClaimed || "수령완료"}</span>
                  ) : (
                    <span style={badgeWaiting}>{t.itemWaiting || "미수령"}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 관리자 도구 */}
      {user?.role === "admin" && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🛠 {t.adminTools || "관리자 도구"}</h2>
          {/* 삭제/수령 처리 등 버튼 (원하면 구현) */}
        </section>
      )}
    </div>
  );
}

// --- 스타일 모음 ---
const wrapperStyle = {
  maxWidth: 420,
  margin: "32px auto",
  padding: "0 6px",
};
const mainTitleStyle = {
  fontSize: "2rem",
  color: "#29b6f6",
  textAlign: "center",
  marginBottom: 18,
  fontWeight: "bold",
  letterSpacing: "-1.5px",
};
const sectionStyle = {
  margin: "18px 0",
  padding: "18px",
  background: "#fff",
  borderRadius: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};
const sectionTitleStyle = {
  fontSize: "1.15rem",
  marginBottom: "10px",
  color: "#0288d1",
};
const logoutBtnStyle = {
  fontSize: "0.8rem",
  padding: "4px 10px",
  backgroundColor: "#cfd8dc",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  color: "#455a64"
};
const itemCardStyle = {
  minHeight: 74,
  border: "1.5px solid #b3e5fc",
  borderRadius: "13px",
  padding: "13px 17px 13px 13px",
  cursor: "pointer",
  background: "#e1f5fe",
  boxShadow: "0 2px 8px #ececec",
  marginBottom: "0px",
};
const thumbStyle = {
  width: 58,
  height: 58,
  objectFit: "cover",
  borderRadius: 11,
  marginRight: 17,
  background: "#fff",
  border: "1px solid #bdbdbd"
};
const emptyThumbStyle = {
  width: 58,
  height: 58,
  borderRadius: 11,
  marginRight: 17,
  background: "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#b0bec5",
  fontSize: 28,
  border: "1px solid #e0e0e0"
};
const badgeDone = {
  background: "#ffe082",
  color: "#bf360c",
  marginLeft: 10,
  padding: "2px 10px",
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 500,
};
const badgeWaiting = {
  background: "#b2ebf2",
  color: "#006064",
  marginLeft: 10,
  padding: "2px 10px",
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 500,
};
