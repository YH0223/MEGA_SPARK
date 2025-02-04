import React, { useState } from "react";
import NoticeModal from "./NoticeModal";
import { useNavigate } from "react-router-dom";

const NoticeList = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const notices = [
    { id: 1, title: "첫 번째 공지", content: "첫 번째 공지 내용입니다." },
    { id: 2, title: "두 번째 공지", content: "두 번째 공지 내용입니다." }
  ];

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h2>공지사항</h2>
      <button onClick={() => navigate("/notice/write")} className="write-btn">글쓰기</button>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id} onClick={() => handleNoticeClick(notice)}>
            {notice.title}
          </li>
        ))}
      </ul>

      {isModalOpen && selectedNotice && (
        <NoticeModal
          notice={selectedNotice}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NoticeList;
