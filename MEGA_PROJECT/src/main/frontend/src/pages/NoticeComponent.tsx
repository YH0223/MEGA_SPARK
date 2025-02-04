import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
            console.error("공지 데이터를 불러오는 중 오류 발생:", error);
        }
    };

    const addNotice = async () => {
        if (!newTitle.trim() || !newContext.trim()) return;

        try {
            const requestBody = {
                noticeTitle: newTitle,
                noticeContext: newContext,
                projectId: projectId
            };

            await axios.post("http://localhost:8080/notice/create", requestBody);

            setNewTitle("");
            setNewContext("");

            fetchNotices();
        } catch (error) {
            console.error("공지 추가 중 오류 발생:", error);
        }
    };

    const handleNoticeClick = (noticeId: number) => {
        console.log(`📝 상세 페이지로 이동: /notice/detail/${noticeId}`);
        navigate(`/notice/detail/${noticeId}`);
    };
    return (
        <div className="notice-container">
            <h2>공지 목록</h2>
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
                <button onClick={addNotice}>추가</button>
            </div>
            <ul className="notice-list">
                {notices.map((notice) => (
                    <li key={notice.noticeId} onClick={() => handleNoticeClick(notice.noticeId)}>
                        <span>{notice.noticeTitle}</span>
                        <small>{new Date(notice.noticeCreatedAt).toLocaleDateString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoticeComponent;
