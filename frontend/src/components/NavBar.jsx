import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLang } from "../locale/LangContext";
import "../styles/NavBar.css";

// 중앙 플로팅 액션 버튼 등은 그대로 둠
export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLang();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* 중앙 플로팅 액션 버튼 */}
      <div className="fab-fixed-area">
        <button
          className="fab-button"
          onClick={toggleMenu}
          aria-label={t.openMenu || "메뉴 열기"}
        >
          +
        </button>
        {menuOpen && (
          <div className="popup-menu">
            <button onClick={() => goTo("/lost/create")}>
              {t.createLost || "분실물 등록"}
            </button>
            <button onClick={() => goTo("/lost-request")}>
              {t.createFound || "습득물 등록"}
            </button>
          </div>
        )}
      </div>

      {/* 하단 내비게이션 (다크모드/언어 토글 완전 제거!) */}
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span role="img" aria-label="홈">🏠</span>
          <span>{t.home || "홈"}</span>
        </NavLink>
        <NavLink to="/lost/list" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span role="img" aria-label="목록">📋</span>
          <span>{t.list || "목록"}</span>
        </NavLink>
        <NavLink to="/requests" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span role="img" aria-label="요청글">📮</span>
          <span>{t.requestList || "요청글"}</span>
        </NavLink>
        <NavLink to="/my" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span role="img" aria-label="내 정보">👤</span>
          <span>{t.myInfoNav || "내정보"}</span>
        </NavLink>
      </nav>
    </>
  );
}
