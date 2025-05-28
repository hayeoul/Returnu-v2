import React, { useEffect, useState } from "react";
import "../styles/EasterEggPage.css";

const messages = [
  "🍀 오늘은 뭔가 좋은 일이 생길 것 같아요!",
  "🌤️ 흐린 날도 지나고 햇살이 찾아옵니다 ☀️",
  "📱 휴대폰, 잃어버리지 않게 조심조심!",
  "🥤 오늘은 버블티 한 잔 어때요?",
  "🎧 이어폰은 제자리에 있나요? 🤔",
  "🧸 너무 지치면 조금 쉬어가도 괜찮아요!",
  "💌 누군가 당신을 응원하고 있어요!",
  "📚 공부도 중요하지만 휴식도 필수!",
  "🌸 오늘의 당신, 완전 만개한 벚꽃 같아요!",
  "🐾 누군가의 하루를 따뜻하게 해줄 수 있는 사람은 바로 당신!",
  "🧠 똑똑하고 따뜻한 당신에게 박수 짝짝!",
  "🪄 오늘은 마법 같은 하루가 될 거예요!",
  "🎁 클릭해줘서 고마워요, 깜짝 선물 받으세요~",
  "🍞 식사 거르지 말고 꼭 챙겨 먹기!",
  "🕊️ 마음이 평화롭기를 바라요~",
];


export default function EasterEggPage() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const random = messages[Math.floor(Math.random() * messages.length)];
    setMsg(random);
  }, []);

  return (
    <div className="easter-egg-container">
      <div className="emoji">🎁</div>
      <p className="easter-msg">{msg}</p>
      <button className="back-btn" onClick={() => window.history.back()}>돌아가기</button>
    </div>
  );
}
