import React, { useState } from "react";
import "./FaqChatbot.css";

const FAQ_LIST = [
  {
    question: "물건을 주웠는데 어떻게 하나요?",
    answer: "학생지원팀(학생회관 1층)으로 제출해주세요.",
  },
  {
    question: "찾으러 가면 뭘 가져가야 하나요?",
    answer: "본인 확인 가능한 신분증이 필요해요.",
  },
  {
    question: "분실물은 얼마나 보관되나요?",
    answer: "최대 2주까지 보관되며 이후 폐기됩니다.",
  },
  {
    question: "등록한 분실물을 나중에 수정하거나 삭제할 수 있나요?",
    answer:
      "네, 등록한 분실물은 [마이페이지] 또는 [내가 등록한 분실물] 메뉴에서 직접 수정하거나 삭제할 수 있습니다. 단, 이미 수령 처리된 분실물은 수정이 제한될 수 있습니다.",
  },
  {
    question: "분실물을 등록할 때 사진은 반드시 첨부해야 하나요?",
    answer:
      "사진 첨부는 선택 사항입니다. 하지만 사진을 함께 등록하면 분실물을 더 쉽게 찾을 수 있으니, 가능한 경우 사진을 첨부하는 것을 권장합니다.",
  },
  {
    question: "내가 입력한 연락처(이메일, 전화번호)가 다른 사람들에게 보여지나요?",
    answer:
      "연락처 정보는 분실물과 관련된 문의나 연락이 필요한 경우에만 제한적으로 공개됩니다. 일반 사용자들에게 무분별하게 공개되지 않으니 안심하세요.",
  },
  {
    question: "쪽지는 어디에서 어떻게 확인할 수 있나요?",
    answer:
      "쪽지는 로그인 후 [쪽지함] 또는 [마이페이지] 메뉴에서 확인할 수 있습니다. 새로운 쪽지가 도착하면 알림이 표시됩니다.",
  },
];

export default function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="faq-chatbot">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">❓ FAQ 챗봇</div>
          <div className="chat-body">
            {selected === null ? (
              FAQ_LIST.map((item, idx) => (
                <button
                  key={idx}
                  className="chat-question"
                  onClick={() => setSelected(idx)}
                >
                  {item.question}
                </button>
              ))
            ) : (
              <>
                <div className="chat-q">{FAQ_LIST[selected].question}</div>
                <div className="chat-a">{FAQ_LIST[selected].answer}</div>
                <button className="chat-back" onClick={() => setSelected(null)}>
                  🔙 돌아가기
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        ❓
      </button>
    </div>
  );
}
