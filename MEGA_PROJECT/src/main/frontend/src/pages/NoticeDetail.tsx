import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Edit, Trash2, Share2, ThumbsUp, Eye, Heart } from "lucide-react";
import "./NoticeDetail.css";



const notices = [
  {
    id: "1",
    title: "시스템 업데이트 공지",
    author: "관리자",
    date: "2024-02-03",
    category: "업데이트",
    content: "이번 업데이트에서 보안 패치와 UI 개선이 포함되었습니다.",
    attachments: ["update-guide.pdf"],
  },
  {
    id: "2",
    title: "긴급 서버 점검 안내",
    author: "관리팀",
    date: "2024-02-02",
    category: "긴급공지",
    content: "2월 5일 01:00 ~ 03:00 사이에 서버 점검이 진행됩니다.",
    attachments: [],
  },
];

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const noticeIndex = notices.findIndex((n) => n.id === id);
  const notice = notices[noticeIndex];
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(Math.floor(Math.random() * 100) + 50);

  if (!notice) {
    return <div className="notice-container">공지사항을 찾을 수 없습니다.</div>;
  }

  const handleLike = () => setLikes(likes + 1);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("공지 링크가 복사되었습니다!");
  };

  return (
    <div className="notice-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} /> 공지 목록으로 돌아가기
      </button>

      <div className="notice-header">
        <h1>{notice.title}</h1>
        <div className="notice-meta">
          <span>👤 {notice.author}</span>
          <span>📅 {notice.date}</span>
          <span>🏷️ {notice.category}</span>
        </div>
      </div>

      <div className="notice-content">
        <p>{notice.content}</p>
        {notice.attachments.length > 0 && (
          <div className="attachments">
            <h3>📎 첨부 파일</h3>
            <ul>
              {notice.attachments.map((file, index) => (
                <li key={index}>
                  <a href={`/${file}`} download>{file}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="notice-actions">
        <button onClick={handleLike} className="like-button">
          <ThumbsUp size={20} /> {likes}
        </button>
        <button className="view-count">
          <Eye size={20} /> {views}
        </button>
        <button onClick={handleShare} className="share-button">
          <Share2 size={20} /> 공유
        </button>
      </div>

      <div className="notice-navigation">
        {noticeIndex > 0 && (
          <button onClick={() => navigate(`/notices/${notices[noticeIndex - 1].id}`)}>
            <ArrowLeft size={18} /> 이전 공지
          </button>
        )}
        {noticeIndex < notices.length - 1 && (
          <button onClick={() => navigate(`/notices/${notices[noticeIndex + 1].id}`)}>
            다음 공지 <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NoticeDetail;
