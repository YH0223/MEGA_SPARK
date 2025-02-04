import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NoticeWrite = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요!");
      return;
    }
    alert("공지 작성 완료!");
    navigate("/project");
  };

  return (
    <div className="notice-write">
      <h2>공지 작성</h2>
      <input
        type="text"
        placeholder="공지 제목 입력..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="공지 내용 입력..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSubmit}>작성 완료</button>
    </div>
  );
};

export default NoticeWrite;
