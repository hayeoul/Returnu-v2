const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8090;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend/build")));

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "returnu-v2",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ----------------------
// 🔽 API 라우터
// ----------------------

// 내/전체 분실물 조회 (userId 파라미터 지원)
app.get("/api/lost-items", (req, res) => {
  const userId = req.query.userId;
  let query, values;

  if (userId) {
    // 내 분실물만
    query = `
      SELECT id, title, location, date, description, image, claimed_by
      FROM lost_items
      WHERE user_id = ?
      ORDER BY id DESC
    `;
    values = [userId];
  } else {
    const limit = parseInt(req.query.limit) || 4;
    query = `
      SELECT id, title, location, date, description, image, claimed_by
      FROM lost_items
      WHERE claimed_by IS NULL OR claimed_by = ''
      ORDER BY id DESC LIMIT ?
    `;
    values = [limit];
  }

  connection.query(query, values, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// 분실물 등록 (user_id 필수)
app.post("/api/lost-items", upload.single("image"), (req, res) => {
  const { title, location, date, description, category, user_id } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !location || !date || !category || !user_id) {
    return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
  }

  const sql = `
    INSERT INTO lost_items (title, location, date, description, category, image, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, location, date, description, category, imagePath, user_id];

  connection.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.status(201).json({ message: "등록 성공", id: result.insertId });
  });
});

// 분실물 검색
app.get("/api/lost-items/search", (req, res) => {
  const query = req.query.query || "";
  const cat = req.query.cat || "전체";
  const status = req.query.status || "전체";
  const order = req.query.order === "asc" ? "ASC" : "DESC";

  const likeQuery = `%${query}%`;
  let sql = `
    SELECT id, title, location, date, claimed_by, image
    FROM lost_items
    WHERE title LIKE ?
  `;
  const values = [likeQuery];

  if (cat !== "전체") {
    sql += ` AND category = ?`;
    values.push(cat);
  }

  if (status === "미수령") {
    sql += ` AND (claimed_by IS NULL OR claimed_by = '')`;
  } else if (status === "수령완료") {
    sql += ` AND claimed_by IS NOT NULL AND claimed_by != ''`;
  }

  sql += ` ORDER BY date ${order}`;

  connection.query(sql, values, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(404).send("데이터 없음");
    res.json(results);
  });
});

// 분실물 상세 조회
app.get("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by,
           IFNULL(created_at, NOW()) as created_at
    FROM lost_items WHERE id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(404).send("데이터 없음");
    res.json(results[0]);
  });
});

// 분실물 수령 처리
app.post("/api/lost-items/claim/:id", (req, res) => {
  const { id } = req.params;
  const { claimed_by } = req.body;

  const query = `
    UPDATE lost_items
    SET claimed_by = ?, claimed_at = NOW()
    WHERE id = ?
  `;
  connection.query(query, [claimed_by, id], (err) => {
    if (err) return res.status(500).send("서버 에러");
    res.status(200).json({ message: "수령 처리 완료" });
  });
});

// 분실물 삭제
app.delete("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM lost_items WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).send("서버 에러");
    if (result.affectedRows === 0) return res.status(404).send("데이터 없음");
    res.status(200).json({ message: "삭제 완료" });
  });
});

// 로그인
app.post("/api/login", (req, res) => {
  const { student_id, password } = req.body;
  if (!student_id || !password) {
    return res.status(400).json({ error: "학번과 비밀번호를 입력해주세요." });
  }

  const query = `
    SELECT name, student_id, role, id
    FROM users
    WHERE student_id = ? AND password = ?
  `;
  connection.query(query, [student_id, password], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (results.length === 0) {
      return res.status(401).json({ error: "학번 또는 비밀번호가 일치하지 않습니다." });
    }
    res.json({ user: results[0] });
  });
});

// 공지사항 목록
app.get("/api/notices", (req, res) => {
  const query = `SELECT id, title, content, created_at FROM notices ORDER BY created_at DESC`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// 습득물 요청형 게시글 등록
app.post("/api/lost-requests", upload.single("image"), (req, res) => {
  const { title, date, location, description, category, phone, email } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !date || !location || !description || (!phone && !email)) {
    return res.status(400).json({ error: "필수 항목이 누락되었습니다. (전화번호 또는 이메일 중 하나 필요)" });
  }

  const sql = `
    INSERT INTO lost_requests (title, date, location, description, category, phone, email, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, date, location, description, category, phone, email, imagePath];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB 오류:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.status(201).json({ message: "요청 등록 완료", id: result.insertId });
  });
});

// 요청형 게시글 전체 조회
app.get("/api/lost-requests", (req, res) => {
  const query = `SELECT * FROM lost_requests ORDER BY date DESC`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// 리액트 SPA 라우팅 지원
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});
