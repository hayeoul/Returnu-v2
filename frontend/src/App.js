import React, { useEffect, useState } from "react";
import { LangProvider } from "./locale/LangContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LostListPage from "./pages/LostListPage";
import LostCreatePage from "./pages/LostCreatePage";
import FoundDetailPage from "./pages/FoundDetailPage";
import ClaimPage from "./pages/ClaimPage";
import MyPage from "./pages/MyPage";
import NavBar from "./components/NavBar";
import "./mobile-ui.css";
import './styles/theme.css';
import LoginPage from "./pages/LoginPage";
import LostRequestPage from "./pages/LostRequestPage";
import LostRequestListPage from "./pages/LostRequestListPage";

function App() {
  // 다크모드 상태 관리 (localStorage 연동)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 테마 토글 함수
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <LangProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Routes>
            {/* theme, toggleTheme 전달! */}
            <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/lost/list" element={<LostListPage />} />
            <Route path="/lost/create" element={<LostCreatePage />} />
            <Route path="/found/:id" element={<FoundDetailPage />} />
            <Route path="/claim/:id" element={<ClaimPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lost-request" element={<LostRequestPage />} />
            <Route path="/requests" element={<LostRequestListPage />} />
          </Routes>
        </div>
        {/* NavBar가 모든 페이지 하단에 필요하면 이대로 남기세요 */}
        <NavBar theme={theme} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </LangProvider>
  );
}

export default App;
