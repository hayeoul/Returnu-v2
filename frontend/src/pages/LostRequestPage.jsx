// src/pages/LostRequestPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale/LangContext";
import "../mobile-ui.css";
import "../styles/LostRequestPage.css";
import Button from "../components/Button";

export default function LostRequestPage() {
  const { t } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    phone: "",
    email: "",
    image: null,
<<<<<<< HEAD
=======
    student_id: "",
>>>>>>> f59e03b (수정본2)
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 유효성 검사
    if (
      !form.title.trim() ||
      !form.date ||
      !form.location.trim() ||
      !form.description.trim() ||
      (!form.phone.trim() && !form.email.trim())
    ) {
      setError(t.requestFormRequired || "필수 항목을 모두 입력해주세요. (전화번호 또는 이메일은 하나 이상 필수)");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      const res = await fetch("http://localhost:8090/api/lost-requests", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("등록 실패");
      alert(t.requestFormSuccess || "요청이 등록되었습니다!");
      navigate("/");
    } catch (err) {
      alert((t.requestFormError || "에러 발생: ") + err.message);
    }
  };

  return (
    <div className="app-wrapper page-container">
      <h1 className="title">{t.requestListTitle || "📝 물건을 찾아주세요!"}</h1>

      <form
        onSubmit={handleSubmit}
        className="form-box"
        encType="multipart/form-data"
      >
        {error && <p className="form-error">⚠️ {error}</p>}

        <label className="input-label">{t.requestFormTitleLabel || "제목 *"}</label>
        <input
          className="input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder={t.requestFormTitlePh || "예: 검정색 지갑을 잃어버렸어요"}
        />

        <label className="input-label">{t.requestFormDateLabel || "분실 날짜 *"}</label>
        <input
          className="input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <label className="input-label">{t.requestFormLocationLabel || "분실 장소 *"}</label>
        <input
          className="input"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder={t.requestFormLocationPh || "예: 학생회관, 도서관"}
        />

<<<<<<< HEAD
        <label className="input-label">{t.requestFormCategoryLabel || "분류 *"}</label>
        <select
          className="input"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="지갑">{t.categoryWallet || "지갑"}</option>
          <option value="노트북">{t.categoryLaptop || "노트북"}</option>
          <option value="휴대폰">{t.categoryPhone || "휴대폰"}</option>
          <option value="이어폰">{t.categoryEarphone || "이어폰"}</option>
          <option value="기타">{t.categoryEtc || "기타"}</option>
        </select>
=======
        {/* ✅ 카테고리(분류) 관련 코드 완전 삭제 */}
>>>>>>> f59e03b (수정본2)

        <label className="input-label">{t.requestFormDescLabel || "상세 설명 *"}</label>
        <textarea
          className="input"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder={t.requestFormDescPh || "잃어버린 상황을 최대한 자세히 적어주세요"}
        />

        <label className="input-label">{t.requestFormPhoneLabel || "전화번호"}</label>
        <input
          className="input"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={t.requestFormPhonePh || "010-1234-5678"}
        />

        <label className="input-label">{t.requestFormEmailLabel || "이메일"}</label>
        <input
          className="input"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t.requestFormEmailPh || "email@example.com"}
        />

        <label className="input-label">{t.requestFormImgLabel || "사진 첨부 (선택)"}</label>
        <input
          className="input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview && (
          <div className="image-preview">
            <p className="preview-label">{t.requestFormImgPreview || "📷 업로드된 이미지"}</p>
            <img
              src={preview}
              alt={t.requestFormImgPreviewAlt || "첨부 이미지 미리보기"}
              className="preview-img"
            />
          </div>
        )}

        <div className="button-group">
          <Button type="submit" variant="primary">
            {t.requestFormSubmit || "요청 등록"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            {t.requestFormCancel || "취소"}
          </Button>
        </div>
      </form>
    </div>
  );
}
