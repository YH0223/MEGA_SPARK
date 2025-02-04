import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./NoticeDetail.css";

interface Notice {
    noticeId: number;
    noticeTitle: string;
    noticeContext: string;
    noticeCreatedAt: string;
}

const NoticeDetail = () => {
    const { noticeId } = useParams<{ noticeId: string }>();
    const navigate = useNavigate();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContext, setEditContext] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!noticeId) {
            setError("공지 ID가 유효하지 않습니다.");
            setLoading(false);
            return;
        }

        const fetchNotice = async () => {
            try {
                console.log(`🔍 요청 URL: http://localhost:8080/notice/detail/${noticeId}`);
                const response = await axios.get(`http://localhost:8080/notice/detail/${noticeId}`);
                console.log("✅ 공지 데이터 API 응답:", response.data);

                setNotice(response.data);
                setEditTitle(response.data.noticeTitle);
                setEditContext(response.data.noticeContext);
                setLoading(false);
            } catch (err) {
                console.error("🛑 공지사항 불러오기 오류:", err);
                setError("공지사항을 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchNotice();
    }, [noticeId]);

    // 공지 수정 함수
    const updateNotice = async () => {
        try {
            if (!editTitle.trim() || !editContext.trim()) {
                alert("제목과 내용을 입력하세요.");
                return;
            }

            await axios.put(`http://localhost:8080/notice/update/${noticeId}`, {
                noticeTitle: editTitle,
                noticeContext: editContext
            });

            alert("공지사항이 수정되었습니다.");
            setNotice({ ...notice!, noticeTitle: editTitle, noticeContext: editContext });
            setIsEditing(false);
        } catch (error) {
            console.error("🛑 공지 수정 오류:", error);
            alert("공지사항 수정에 실패했습니다.");
        }
    };

    // 공지 삭제 함수
    const deleteNotice = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`http://localhost:8080/notice/delete/${noticeId}`);
            alert("공지사항이 삭제되었습니다.");
            navigate(-1); // 이전 페이지로 이동
        } catch (error) {
            console.error("🛑 공지 삭제 오류:", error);
            alert("공지사항 삭제에 실패했습니다.");
        }
    };

    if (loading) return <p>⏳ 공지사항을 불러오는 중...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="notice-detail-container">
            <h2>공지사항 상세보기</h2>
            {isEditing ? (
                <>
                    <input
                        className="notice-edit-input"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="공지 제목 입력"
                    />
                    <textarea
                        className="notice-edit-textarea"
                        value={editContext}
                        onChange={(e) => setEditContext(e.target.value)}
                        placeholder="공지 내용 입력"
                    />
                    <button onClick={updateNotice}>저장</button>
                    <button onClick={() => setIsEditing(false)}>취소</button>
                </>
            ) : (
                <>
                    <h3>{notice?.noticeTitle || "제목 없음"}</h3>
                    <p>{notice?.noticeContext || "내용 없음"}</p>
                    <small>작성일: {notice?.noticeCreatedAt ? new Date(notice.noticeCreatedAt).toLocaleDateString() : "날짜 없음"}</small>
                    <div className="notice-actions">
                        <button onClick={() => setIsEditing(true)}>수정</button>
                        <button onClick={deleteNotice}>삭제</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NoticeDetail;
