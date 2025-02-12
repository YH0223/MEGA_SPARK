import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App"; // ✅ AuthContext 가져오기
import { Edit, Trash2, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify"; // ✅ import 추가
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS 추가
import "./NoticeDetail.css";
import api from "../api";
import ConfirmModal from "./ConfirmModal";
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
    const [isConfirmOpen, setConfirmOpen] = useState(false);


    useEffect(() => {
        if (isAuthenticated) fetchNotice();
    }, [noticeId, isAuthenticated]);

    const fetchNotice = async () => {
        try {
            const response = await api.get(`/notice/detail/${noticeId}`);
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
            await api.put(`/notice/update/${noticeId}`, {
                noticeTitle: editTitle,
                noticeContext: editContext
            });

            toast.success("✅ 공지가 수정되었습니다!", {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "230px" }, // ✅ 고정된 가로 크기
            });
            setNotice({ ...notice!, noticeTitle: editTitle, noticeContext: editContext });
            setIsEditing(false);
            setTimeout(() => {
                closeModal(); // ✅ 1.3초 후 모달 닫기
            }, 1000);
        } catch (error) {
            console.error("공지 수정 오류:", error);
        }
    };

    /** ✅ 공지 삭제 (모달에서 실행됨) */
    const deleteNotice = async () => {
        try {
            await api.delete(`/notice/delete/${noticeId}`);
            toast.success("✅ 공지가 삭제되었습니다!", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "230px" },
            });
            setTimeout(() => {
                closeModal();
            }, 1500);
        } catch (error) {
            console.error("공지 삭제 오류:", error);
        }
    };

    if (!notice) return <p>공지사항을 불러오는 중...</p>;

    return (

    <div className="notice-detail-container">
        <ConfirmModal
            isOpen={isConfirmOpen}
            message="⚠️ 해당 TaskList와 모든 Task가 삭제됩니다. 진행하시겠습니까?"
            onConfirm={deleteNotice}  // 🛑 여기서 함수가 실행되지 않을 가능성 있음
            onCancel={() => setConfirmOpen(false)}
        />

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
                        <button onClick={() => setConfirmOpen(true)}> {/* ✅ 모달 오픈 */}
                            <Trash2 size={16}/> 삭제
                        </button>
                        <button onClick={closeModal}>
                            <X size={16}/> 닫기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NoticeDetail;
