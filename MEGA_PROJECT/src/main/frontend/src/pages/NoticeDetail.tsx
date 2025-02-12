import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App"; // ✅ AuthContext 가져오기
import { Edit, Trash2, Save, X } from "lucide-react";
import "./NoticeDetail.css";

interface Notice {
    noticeId: number;
    noticeTitle: string;
    noticeContext: string;
    noticeCreatedAt: string;
}

axios.defaults.withCredentials = true;

const NoticeDetail = ({ noticeId, closeModal }: { noticeId: number, closeModal: () => void }) => {
    const { isAuthenticated } = useContext(AuthContext)!;
    const [notice, setNotice] = useState<Notice | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContext, setEditContext] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isAuthenticated) fetchNotice();
    }, [noticeId, isAuthenticated]);

    const fetchNotice = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/notice/detail/${noticeId}`);
            setNotice(response.data);
            setEditTitle(response.data.noticeTitle);
            setEditContext(response.data.noticeContext);
        } catch (error) {
            console.error("❌ 공지사항 불러오기 오류:", error);
        }
    };

    /** ✅ 공지 수정 */
    const updateNotice = async () => {
        try {
            await axios.put(`http://localhost:8080/notice/update/${noticeId}`, {
                noticeTitle: editTitle,
                noticeContext: editContext
            });

            alert("공지사항이 수정되었습니다.");
            setNotice({ ...notice!, noticeTitle: editTitle, noticeContext: editContext });
            setIsEditing(false);
        } catch (error) {
            console.error("공지 수정 오류:", error);
        }
    };

    /** ✅ 공지 삭제 */
    const deleteNotice = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`http://localhost:8080/notice/delete/${noticeId}`);
            alert("공지사항이 삭제되었습니다.");
            closeModal(); // ✅ 삭제 후 모달 닫기
        } catch (error) {
            console.error("공지 삭제 오류:", error);
        }
    };

    if (!notice) return <p>공지사항을 불러오는 중...</p>;

    return (
        <div className="notice-detail-container">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        className="notice-edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                    <textarea
                        className="notice-edit-textarea"
                        value={editContext}
                        onChange={(e) => setEditContext(e.target.value)}
                        placeholder="내용을 입력하세요"
                    />
                    <div className="notice-actions">
                        <button className="save-button" onClick={updateNotice}>
                            <Save size={16} /> 저장
                        </button>
                        <button className="cancel-button" onClick={() => setIsEditing(false)}>
                            <X size={16} /> 취소
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className="notice-title">{notice.noticeTitle}</h3>
                    <div className="notice-separator" /> {/* 🔥 구분선을 추가합니다 */}
                    <p className="notice-content">{notice.noticeContext}</p>
                    <div className="notice-actions">
                        <button onClick={() => setIsEditing(true)}>
                            <Edit size={16} /> 수정
                        </button>
                        <button onClick={deleteNotice}>
                            <Trash2 size={16} /> 삭제
                        </button>
                        <button onClick={closeModal}>
                            <X size={16} /> 닫기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NoticeDetail;
