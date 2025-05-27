import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mainImage from "./assets/main_illustration.png";
import NoticeSlider from "../components/NoticeSlider";
import "../styles/HomePage.css";
import { useLang } from "../locale/LangContext";

<<<<<<< HEAD
// 다크모드/언어 옵션
const LANGS = [
  { code: "ko", icon: "🇰🇷", label: "한국어" },
  { code: "en", icon: "🇺🇸", label: "English" }
];

export default function HomePage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [openCat, setOpenCat] = useState(false);
  const catRef = useRef();
=======
export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("분실물");
>>>>>>> f59e03b (수정본2)

  const [notices, setNotices] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);

<<<<<<< HEAD
  // 번역 훅
  const { t, lang, setLang } = useLang();

  // 언어 드롭다운
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef();
  const currentLang = LANGS.find(l => l.code === lang);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCat(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("http://localhost:8090/api/notices");
        if (!res.ok) throw new Error("공지사항을 불러오지 못했습니다.");
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/lost/list?query=${encodeURIComponent(search)}&cat=${encodeURIComponent(category)}`);
  };

  // --- 여기서부터 ---
  return (
    <div className="app-wrapper renew-home">
      {notices.length > 0 && <NoticeSlider notices={notices} />}

      {/* 검색창 */}
      <form onSubmit={handleSearch} className="renew-search-form">
        <div className="renew-searchbar">
          <div
            ref={catRef}
            className="renew-category-dropdown"
            onClick={() => setOpenCat((o) => !o)}
          >
            {category} <span className="dropdown-arrow">▾</span>
            {openCat && (
              <ul className="renew-category-list">
                {["전체", "지갑", "휴대폰", "노트북", "이어폰", "열쇠", "기타"].map((cat) => (
                  <li
                    key={cat}
                    className={cat === category ? "active" : ""}
                    onClick={() => {
                      setCategory(cat);
                      setOpenCat(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="renew-input-box">
            <input
              type="text"
              placeholder={t.homeSearchPlaceholder || "분실물 검색어 입력"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="renew-search-btn">🔍</button>
          </div>
        </div>
      </form>

      {/* ----------- */}
      {/* 🌙🗺️ 다크모드/언어 토글 섹션 */}
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          margin: "18px 0 16px 0",
          justifyContent: "flex-end"
        }}
      >
        {/* 언어 드롭다운 */}
        <div ref={langRef} style={{ position: "relative" }}>
          <button
            onClick={() => setLangOpen((o) => !o)}
            style={{
              background: theme === "dark" ? "#222" : "#f7f7fa",
              color: theme === "dark" ? "#ffe082" : "#223",
              border: "none",
              borderRadius: 7,
              padding: "5px 16px 5px 10px",
              fontWeight: 600,
              fontSize: "0.97rem",
              boxShadow: theme === "dark" ? "0 2px 10px #1117" : "0 1px 6px #eaeaea90",
              cursor: "pointer",
              minWidth: 92,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <span style={{ fontSize: "1.13em", marginRight: 2 }}>{currentLang?.icon}</span>
            {currentLang?.label}
            <span style={{
              fontSize: "1em",
              marginLeft: 4,
              transform: langOpen ? "rotate(180deg)" : "none",
              transition: "transform .18s"
            }}>▼</span>
          </button>
          {langOpen && (
            <div
              style={{
                position: "absolute",
                top: 36,
                left: 0,
                minWidth: "100%",
                background: theme === "dark" ? "#222" : "#fff",
                color: theme === "dark" ? "#ffe082" : "#223",
                boxShadow: theme === "dark" ? "0 2px 16px #101c" : "0 2px 16px #aac",
                borderRadius: 8,
                overflow: "hidden",
                zIndex: 22
              }}
            >
              {LANGS.map(option => (
                <div
                  key={option.code}
                  style={{
                    padding: "10px 18px",
                    cursor: "pointer",
                    fontWeight: option.code === lang ? 700 : 400,
                    background: option.code === lang
                      ? (theme === "dark" ? "#35387a" : "#e4e9ff")
                      : "transparent",
                    color: option.code === lang
                      ? (theme === "dark" ? "#ffe082" : "#234")
                      : (theme === "dark" ? "#ffe082" : "#234")
                  }}
                  onClick={() => {
                    setLang(option.code);
                    setLangOpen(false);
                  }}
                >
                  <span style={{ fontSize: "1.13em", marginRight: 8 }}>{option.icon}</span>
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 다크모드 버튼 */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "라이트 모드" : "다크 모드"}
          style={{
            fontSize: "1.6em",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: theme === "dark" ? "#ffe082" : "#ffd600",
            outline: "none"
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
      {/* ----------- */}

      {/* 나머지 메인페이지 내용 */}
      <div className="renew-main-illust">
        <img
          src={mainImage}
          alt={t.homeMainImageAlt || "메인 일러스트"}
          className="main-illust-img"
        />
        <p className="renew-guide-text">{t.homeLookingForLost || "분실물을 찾고 있나요?"}</p>
        <p className="renew-sub-guide-text">{t.homeReadBelow || "아래 내용을 꼭 읽어주세요!"}</p>
      </div>

      <div className="renew-guide-card">
        <div className="renew-guide-icon">🧭</div>
        <div>
          <strong>{t.homeGuideTitle || "ReturnU 사용 가이드"}</strong>
          <div className="renew-guide-detail">
            <div>🔍 <b>{t.homeSearchBox || "검색창"}</b>{t.homeGuideSearch || "에 분실물을 검색해보세요."}</div>
            <div>➕ <b>{t.homeRegisterBtn || "등록 버튼"}</b>{t.homeGuideRegister || "을 눌러 분실물·습득물도 등록할 수 있어요!"}</div>
          </div>
        </div>
      </div>

      <div className="renew-info-faq">
        <div className="renew-info-card">
          <p className="renew-info-title">❓ {t.faqTitle || "자주 묻는 질문"}</p>
          <p className="renew-info-desc">
            <strong>{t.faqQ1 || "Q. 물건을 주웠는데 어떻게 하나요?"}</strong><br />
            👉 {t.faqA1 || "학생지원팀(학생회관 1층)으로 제출해주세요."}<br /><br />
            <strong>{t.faqQ2 || "Q. 찾으러 가면 뭘 가져가야 하나요?"}</strong><br />
            👉 {t.faqA2 || "본인 확인 가능한 신분증이 필요해요."}<br /><br />
            <strong>{t.faqQ3 || "Q. 분실물은 얼마나 보관되나요?"}</strong><br />
            👉 {t.faqA3 || "최대 2주까지 보관되며 이후 폐기됩니다."}
          </p>
        </div>
=======
  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("http://localhost:8090/api/notices");
        if (!res.ok) throw new Error("공지사항을 불러오지 못했습니다.");
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    // ✅ 카테고리 파라미터 제거!
    navigate(`/lost/list?query=${encodeURIComponent(search)}`);
  };

  return (
    <div className="app-wrapper">
      {/* ✅ 공지사항 먼저 */}
      {notices.length > 0 && <NoticeSlider notices={notices} />}

      {/* ✅ 타이틀 중앙정렬 */}
      <div style={{
        textAlign: "center",
        margin: "24px 0 10px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
      }}>
        <img src="https://cdn-icons-png.flaticon.com/512/4783/4783110.png" alt="ReturnU Icon"
          style={{ width: "30px", height: "30px" }} />
        <h1 style={{ fontSize: "1.8rem", color: "#d19c66", margin: 0 }}>ReturnU</h1>
      </div>

      {/* ✅ 검색창 (카테고리 없음) */}
      <form onSubmit={handleSearch} style={{ maxWidth: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ position: "relative", flex: 1, height: "48px" }}>
            <input
              type="text"
              className="input"
              placeholder="검색어 입력"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                padding: "0 48px 0 16px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button type="submit" style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              color: "#888",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}>🔍</button>
          </div>
        </div>
      </form>

      {/* ✅ 습득물 / 분실물 선택 탭형 버튼 */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "16px",
        padding: "4px",
        borderRadius: "16px",
        background: "#f2f2f2",
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        {["분실물", "습득물"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: "8px 20px",
              borderRadius: "16px",
              border: "none",
              background: selectedType === type ? "#d19c66" : "transparent",
              color: selectedType === type ? "#fff" : "#555",
              fontWeight: "bold",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            {type}
          </button>
        ))}
>>>>>>> f59e03b (수정본2)
      </div>

      {/* ✅ 일러스트 + 안내 */}
      <div className="home-illustration">
        <img src={mainImage} alt="메인 일러스트" className="main-image" />
        <p className="guide-text">분실물을 찾고 있나요?</p>
        <p className="sub-guide-text">아래 내용을 꼭 읽어주세요!!</p>
      </div>

      {/* ✅ 안내 박스 */}
      <div className="usage-guide-box">
        🧭 <strong>ReturnU 사용 가이드</strong><br />
        🔍 <strong>검색창에</strong> 분실물을 검색해보세요.<br />
        ➕ 버튼을 누르면 <strong>분실물·습득물 등록</strong>도 할 수 있어요!
      </div>

      <FaqChatbot />
    </div>
  );
}
