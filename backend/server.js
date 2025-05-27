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

<<<<<<< HEAD
// ----------------------
// 🔽 API 라우터
// ----------------------

// 내/전체 분실물 조회 (userId 파라미터 지원)
=======
// 쪽지 전송 API (is_read 포함)
app.post("/api/messages", (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  const query = `
    INSERT INTO messages (sender_id, receiver_id, content, is_read)
    VALUES (?, ?, ?, 0)
  `;
  connection.query(query, [sender_id, receiver_id, content], (err, result) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.status(201).json({ message: "쪽지 전송 완료", id: result.insertId });
  });
});

app.get("/api/messages/received/:studentId", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT * FROM messages WHERE receiver_id = ? ORDER BY sent_at DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.json(results);
  });
});

app.get("/api/messages/sent/:studentId", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT * FROM messages WHERE sender_id = ? ORDER BY sent_at DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.json(results);
  });
});

app.get("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM messages WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 오류");
    if (results.length === 0) return res.status(404).send("쪽지 없음");
    res.json(results[0]);
  });
});

app.patch("/api/messages/read/:id", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE messages SET is_read = 1 WHERE id = ?";
  connection.query(query, [id], (err) => {
    if (err) return res.status(500).send("서버 오류");
    res.status(200).json({ message: "읽음 처리 완료" });
  });
});

app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM messages WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("서버 오류");
    res.status(200).json({ message: "삭제 완료" });
  });
});

// 🔽 요청 전체 조회 (category 없음)
app.get("/api/lost-requests", (req, res) => {
  const query = `SELECT id, title, date, location, description, phone, email, image, created_at, student_id FROM lost_requests ORDER BY date DESC`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// 🔽 요청글 삭제 API (admin만 사용 가정)
app.delete("/api/lost-requests/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM lost_requests WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ 요청 삭제 오류:", err);
      return res.status(500).json({ error: "삭제 실패" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "해당 글이 없습니다." });
    }
    res.status(200).json({ message: "삭제 완료" });
  });
});

// 🔽 요청 상세 조회 (category 없음)
app.get("/api/lost-requests/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, title, date, location, description, phone, email, image, student_id, created_at
    FROM lost_requests
    WHERE id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (results.length === 0) return res.status(404).json({ error: "해당 요청 없음" });
    res.json(results[0]);
  });
});

// 🔽 분실물 요청 등록 (category 없음)
app.post("/api/lost-requests", upload.single("image"), (req, res) => {
  const {
    title, date, location, description,
    phone, email, student_id
  } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !date || !location || !description || (!phone && !email)) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  const sql = `
    INSERT INTO lost_requests 
    (title, date, location, description, phone, email, image, student_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, date, location, description, phone, email, imagePath, student_id];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ 분실물 요청 등록 실패:", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.status(201).json({ message: "요청 등록 성공", id: result.insertId });
  });
});

// 🔽 이하 lost-items(습득물), 로그인, 공지사항, 마이페이지 등 나머지 API는 기존과 동일하게 유지 (category 사용 안 함)
// (아래 생략한 부분도 category 관련 없는 코드만 사용)

>>>>>>> f59e03b (수정본2)
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
<<<<<<< HEAD
  const { title, location, date, description, category, user_id } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !location || !date || !category || !user_id) {
=======
  const { title, location, date, description, student_id } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !location || !date) {
>>>>>>> f59e03b (수정본2)
    return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
  }

  const sql = `
<<<<<<< HEAD
    INSERT INTO lost_items (title, location, date, description, category, image, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, location, date, description, category, imagePath, user_id];
=======
    INSERT INTO lost_items (title, location, date, description, image, student_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [title, location, date, description, imagePath, student_id];
>>>>>>> f59e03b (수정본2)

  connection.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.status(201).json({ message: "등록 성공", id: result.insertId });
  });
});

<<<<<<< HEAD
// 분실물 검색
=======
// 🔽 분실물 검색 (category 필드/파라미터 사용 안 함)
>>>>>>> f59e03b (수정본2)
app.get("/api/lost-items/search", (req, res) => {
  const query = req.query.query || "";
  const status = req.query.status || "전체";
  const order = req.query.order === "asc" ? "ASC" : "DESC";

  const likeQuery = `%${query}%`;
  let sql = `
    SELECT id, title, location, date, claimed_by, image
    FROM lost_items
    WHERE title LIKE ?
  `;
  const values = [likeQuery];

<<<<<<< HEAD
  if (cat !== "전체") {
    sql += ` AND category = ?`;
    values.push(cat);
  }

=======
>>>>>>> f59e03b (수정본2)
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

<<<<<<< HEAD
// 분실물 상세 조회
=======
>>>>>>> f59e03b (수정본2)
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

<<<<<<< HEAD
// 로그인
=======
// 🔽 로그인/공지사항/마이페이지 등 기존 코드와 동일 (category 사용 X)

>>>>>>> f59e03b (수정본2)
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

<<<<<<< HEAD
// 공지사항 목록
=======
>>>>>>> f59e03b (수정본2)
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

<<<<<<< HEAD
// 요청형 게시글 전체 조회
app.get("/api/lost-requests", (req, res) => {
  const query = `SELECT * FROM lost_requests ORDER BY date DESC`;
=======
app.get("/api/users/:studentId/lost-items", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT id, title, location, date
    FROM lost_items
    WHERE student_id = ?
    ORDER BY date DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

app.get("/api/users/:studentId/lost-requests", (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT id, title, location, date
    FROM lost_requests
    WHERE student_id = ?
    ORDER BY date DESC
  `;
  connection.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

app.get("/api/lost-items/expiring-soon", (req, res) => {
  const query = `
    SELECT id, title, location, DATE_ADD(created_at, INTERVAL 14 DAY) AS expireDate
    FROM lost_items
    WHERE (claimed_by IS NULL OR claimed_by = '')
      AND DATE_ADD(created_at, INTERVAL 14 DAY) <= DATE_ADD(NOW(), INTERVAL 3 DAY)
    ORDER BY created_at ASC
  `;
>>>>>>> f59e03b (수정본2)
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
