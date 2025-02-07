import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import { Bell, Plus } from "lucide-react";
import "./NoticeComponent.css";

axios.defaults.withCredentials = true;

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
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;

    useEffect(() => {
        axios.get("http://localhost:8080/api/session")
            .then(response => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
                navigate("/");
            });
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotices();
        }
    }, [isAuthenticated]);

    const fetchNotices = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/notice/${projectId}`);
            setNotices(response.data);
        } catch (error) {
            console.error("📜 공지 데이터를 불러오는 중 오류 발생:", error);
        }
    };

    const handleNoticeClick = (noticeId: number) => {
        navigate(`/notice/detail/${noticeId}`);
    };

    const addNotice = async () => {
        if (!newTitle.trim() || !newContext.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/notice/create", {
                noticeTitle: newTitle,
                noticeContext: newContext,
                projectId
            });

            alert("공지사항이 작성되었습니다.");
            setNewTitle("");
            setNewContext("");
            setIsWriting(false);
            fetchNotices();
        } catch (error) {
            console.error("📜 공지 추가 중 오류 발생:", error);
        }
    };

    if (!isAuthenticated) return <p>세션 확인 중...</p>;

    return (
        <div className="notice-box">
            {/* 🔔 제목 + ➕작성 버튼 한 줄 정렬 */}
            <div className="notice-header">
                <h2><Bell size={20} /> 프로젝트 게시판</h2>
                <button className="add-notice-btn" onClick={() => setIsWriting(!isWriting)}>
                    {isWriting ? "취소" : <><Plus size={16} /> 작성</>}
                </button>
            </div>

            {/* 📝 공지 작성 폼 */}
            {isWriting && (
                <div className="notice-input">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="공지 제목 입력..."
                        className="notice-input-field"
                    />
                    <textarea
                        value={newContext}
                        onChange={(e) => setNewContext(e.target.value)}
                        placeholder="공지 내용 입력..."
                        className="notice-textarea"
                    />
                    <button className="notice-submit-btn" onClick={addNotice}>등록</button>
                </div>
            )}

            {/* 📋 공지사항 테이블 */}
            <table className="notice-table">
                <thead>
                    <tr>
                        <th>📄 제목</th>
                        <th>🕒 등록일</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map((notice) => (
                        <tr key={notice.noticeId} onClick={() => handleNoticeClick(notice.noticeId)}>
                            <td>{notice.noticeTitle}</td>
                            <td>{new Date(notice.noticeCreatedAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NoticeComponent;
