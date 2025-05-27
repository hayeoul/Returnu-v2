// src/pages/LostCreatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../mobile-ui.css";
import { useLang } from "../locale/LangContext"; // ⭐️ 번역 훅 추가
import Button from "../components/Button";

export default function LostCreatePage() {
  const { t } = useLang(); // ⭐️ 번역 객체
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!form.title.trim()) return setError(t.createLostItemTitleRequired || "물건 이름을 입력해주세요.");
    if (!form.location.trim()) return setError(t.createLostItemLocationRequired || "분실 장소를 입력해주세요.");
    if (!form.date) return setError(t.createLostItemDateRequired || "분실 날짜를 선택해주세요.");
    if (!form.category) return setError(t.createLostItemCategoryRequired || "카테고리를 선택해주세요.");

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });
=======

    if (!form.title.trim()) return setError("물건 이름을 입력해주세요.");
    if (!form.location.trim()) return setError("분실 장소를 입력해주세요.");
    if (!form.date) return setError("분실 날짜를 선택해주세요.");

    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }
    if (user?.student_id) {
      formData.append("student_id", user.student_id);
    }
>>>>>>> f59e03b (수정본2)

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8090/api/lost-items", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(t.createLostItemFail || "등록 실패");
      const result = await res.json();
      alert(t.createLostItemSuccess || "분실물 등록 완료!");
      navigate(`/found/${result.id}`);
    } catch (err) {
      alert((t.createLostItemError || "에러 발생: ") + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: "",
      location: "",
      date: "",
      description: "",
      image: null,
    });
    setPreview(null);
    setError("");
  };

  return (
<<<<<<< HEAD
    <div className="app-wrapper page-container">
      <h1 className="title">{t.createLostItemTitle || "📮 분실물 등록"}</h1>

      <form onSubmit={handleSubmit} className="form-box">
        <p className="form-note">
          {t.createLostItemNote || "* 필수 항목은 모두 입력해야 합니다."}
=======
    <div className="app-wrapper">
      <h1 className="title">📮 분실물 등록</h1>
      <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
        <p style={{ fontSize: "0.9rem", color: "#999", marginBottom: "12px" }}>
          * 필수 항목은 모두 입력해야 합니다.
>>>>>>> f59e03b (수정본2)
        </p>

        {error && <p className="form-error">⚠️ {error}</p>}

        <label className="input-label">{t.createLostItemNameLabel || "물건 이름 *"}</label>
        <input
          className="input"
          name="title"
          placeholder={t.createLostItemNamePh || "예: 검정색 지갑"}
          value={form.title}
          onChange={handleChange}
        />

        <label className="input-label">{t.createLostItemLocationLabel || "분실 장소 *"}</label>
        <input
          className="input"
          name="location"
          placeholder={t.createLostItemLocationPh || "예: 도서관 2층"}
          value={form.location}
          onChange={handleChange}
        />

        <label className="input-label">{t.createLostItemDateLabel || "분실 날짜 *"}</label>
        <input
          className="input"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

<<<<<<< HEAD
        <label className="input-label">{t.createLostItemCategoryLabel || "카테고리 *"}</label>
        <select
          name="category"
          className="input"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">{t.createLostItemCategorySelect || "카테고리 선택"}</option>
          <option value="지갑">{t.categoryWallet || "지갑"}</option>
          <option value="휴대폰">{t.categoryPhone || "휴대폰"}</option>
          <option value="노트북">{t.categoryLaptop || "노트북"}</option>
          <option value="이어폰">{t.categoryEarphone || "이어폰"}</option>
          <option value="열쇠">{t.categoryKey || "열쇠"}</option>
          <option value="기타">{t.categoryEtc || "기타"}</option>
        </select>
=======
        {/* 카테고리 선택 UI 완전 삭제 */}
>>>>>>> f59e03b (수정본2)

        <label className="input-label">{t.createLostItemDescLabel || "자세한 설명"}</label>
        <textarea
          className="input"
          name="description"
          placeholder={t.createLostItemDescPh || "특징, 색상, 브랜드 등"}
          rows="4"
          value={form.description}
          onChange={handleChange}
        />

        <label className="input-label">{t.createLostItemImgLabel || "사진 업로드"}</label>
        <input
          className="input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {preview && (
          <div className="image-preview">
            <p className="preview-label">{t.createLostItemImgPreview || "📷 업로드된 이미지"}</p>
            <img
              src={preview}
              alt={t.createLostItemImgPreviewAlt || "미리보기"}
              className="preview-img"
            />
          </div>
        )}

        {/* 버튼 그룹 */}
        <div className="button-group">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (t.createLostItemSubmitting || "등록 중...") : (t.createLostItemSubmit || "등록하기")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
          >
            {t.createLostItemReset || "초기화"}
          </Button>
        </div>
      </form>
    </div>
  );
}
