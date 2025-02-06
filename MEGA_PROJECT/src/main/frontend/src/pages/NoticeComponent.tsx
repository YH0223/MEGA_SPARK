import  React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App"; // ✅ AuthContext 가져오기
import "./NoticeComponent.css";

// ✅ Axios 기본 설정: 세션 유지
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

    /** ✅ 세션 유지 확인 */
    useEffect(() => {
        axios.get("http://localhost:8080/api/session")
            .then(response => {
                console.log("✅ 로그인 유지됨. 사용자:", response.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                console.log("❌ 로그인 세션 없음");
                setIsAuthenticated(false);
                navigate("/"); // 미로그인 시 로그인 페이지로 이동
            });
    }, [setIsAuthenticated, navigate]);

    /** ✅ 공지 목록 불러오기 */
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotices();
        }
    }, [isAuthenticated]);

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

    /** ✅ 공지 작성 */
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

    if (!isAuthenticated) return <p>세션 확인 중...</p>;

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h2>프로젝트 게시판</h2>
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
                        <span className="notice-date">
                            🕒 {new Date(notice.noticeCreatedAt).toLocaleDateString()} {/* ✅ 등록일 출력 */}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoticeComponent;
