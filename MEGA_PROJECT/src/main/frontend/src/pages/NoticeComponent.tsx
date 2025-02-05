import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NoticeComponent.css";

interface Notice {
    noticeId: number;
    noticeTitle: string;
    noticeCreatedAt: string;
}

const NoticeComponent = ({ projectId }: { projectId: number }) => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContext, setNewContext] = useState("");
    const [isWriting, setIsWriting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/notice/${projectId}`);
            console.log("📜 공지 목록 API 응답:", response.data);
            setNotices(response.data);
        } catch (error) {
            console.error("📜 공지 데이터를 불러오는 중 오류 발생:", error);
        }
    };

    /** ✅ 공지 클릭 시 상세 페이지 이동 */
    const handleNoticeClick = (noticeId: number) => {
        console.log(`📝 상세 페이지로 이동: /notice/detail/${noticeId}`);
        navigate(`/notice/detail/${noticeId}`);
    };

    /** ✅ 공지 작성 함수 */
    const addNotice = async () => {
        if (!newTitle.trim() || !newContext.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            const requestBody = {
                noticeTitle: newTitle,
                noticeContext: newContext,
                projectId: projectId
            };

            await axios.post("http://localhost:8080/notice/create", requestBody);
            alert("공지사항이 작성되었습니다.");
            setNewTitle("");
            setNewContext("");
            setIsWriting(false);
            fetchNotices(); // 공지 추가 후 목록 새로고침
        } catch (error) {
            console.error("📜 공지 추가 중 오류 발생:", error);
        }
    };

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h2>공지 목록</h2>
                <button className="right-align-button" onClick={() => setIsWriting(!isWriting)}>
                    {isWriting ? "취소" : "작성"}
                </button>
            </div>

            {/* 공지 작성 폼 */}
            {isWriting && (
                <div className="notice-input">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="공지 제목 입력..."
                    />
                    <textarea
                        value={newContext}
                        onChange={(e) => setNewContext(e.target.value)}
                        placeholder="공지 내용 입력..."
                    />
                    <button onClick={addNotice}>등록</button>
                </div>
            )}

            {/* 공지 목록 */}
            <ul className="notice-list">
                {notices.map((notice) => (
                    <li key={notice.noticeId} onClick={() => handleNoticeClick(notice.noticeId)}>
                        <span>{notice.noticeTitle}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoticeComponent;
