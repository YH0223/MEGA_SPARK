import React, { useState } from "react";

const NoticeModal = ({ notice, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content);

  const handleSave = () => {
    alert("공지 수정 완료!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      alert("공지 삭제됨!");
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isEditing ? "공지 수정" : notice.title}</h2>

        {isEditing ? (
          <div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleSave}>저장</button>
          </div>
        ) : (
          <p>{notice.content}</p>
        )}

        <div className="modal-actions">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "취소" : "수정"}
          </button>
          <button onClick={handleDelete}>삭제</button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
