import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { ToastContainer, toast } from "react-toastify"; // ✅ import 추가
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS 추가
import { Bell, Plus, X } from "lucide-react";
import NoticeDetail from "./NoticeDetail"; // ✅ NoticeDetail 추가
import "./NoticeComponent.css";
import api from "../api";
axios.defaults.withCredentials = true;

interface Notice {
    noticeId: number;
    noticeTitle: string;
    noticeContext: string;
    noticeCreatedAt: string;
}

const NoticeComponent = ({ projectId }: { projectId: number }) => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContext, setNewContext] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null); // ✅ 선택된 공지 ID
    const [isAddingNotice, setIsAddingNotice] = useState(false); // ✅ 공지 추가 모달 상태 추가
    const { isAuthenticated } = useContext(AuthContext)!;

    useEffect(() => {
        if (isAuthenticated) fetchNotices();
    }, [isAuthenticated]);

    const fetchNotices = async () => {
        try {
            const response = await api.get(`/notice/${projectId}`);
            const sortedNotices = response.data.sort(
                (a: Notice, b: Notice) => new Date(b.noticeCreatedAt).getTime() - new Date(a.noticeCreatedAt).getTime()
            );
            setNotices(sortedNotices);
        } catch (error) {
            console.error("📜 공지 데이터를 불러오는 중 오류 발생:", error);
        }
    };

    /** ✅ 공지 추가 모달 열기 */
    const openAddModal = () => {
        setNewTitle("");
        setNewContext("");
        setSelectedNoticeId(null); // 새 공지 작성 시 기존 선택 초기화
        setIsAddingNotice(true);
        setIsModalOpen(true);
    };

    /** ✅ 공지 상세 모달 열기 */
    const openDetailModal = (noticeId: number) => {
        setSelectedNoticeId(noticeId);
        setIsAddingNotice(false);
        setIsModalOpen(true);
    };

    /** ✅ 모달 닫기 */
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNoticeId(null);
        setIsAddingNotice(false);
        fetchNotices(); // ✅ 닫을 때 목록 갱신
    };

    /** ✅ 공지 추가 기능 */
    const addNotice = async () => {
        if (!newTitle.trim() || !newContext.trim()) {
            toast.error(`❌ 제목과 내용을 입력해주새요`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
            });
            return;
        }

        try {
            await api.post("/notice/create", {
                noticeTitle: newTitle,
                noticeContext: newContext,
                projectId
            });

            toast.success("✅ 공지가 작성되었습니다!", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "230px" }, // ✅ 고정된 가로 크기
            });
            setNewTitle("");
            setNewContext("");
            closeModal(); // ✅ 공지 작성 후 모달 닫기
        } catch (error) {
            console.error("📜 공지 추가 중 오류 발생:", error);
        }
    };

    return (
        <div className="notice-box">
            {/* 🔔 제목 + ➕작성 버튼 한 줄 정렬 */}
            <div className="notice-header">
                <h2><Bell size={20} /> 프로젝트 게시판</h2>
                <button className="add-notice-btn" onClick={openAddModal}>
                    <Plus size={16} /> 작성
                </button>
            </div>

            {/* 📋 공지사항 테이블 (스크롤 가능하도록 개선) */}
            <div className="notice-table-container">
                <table className="notice-table">
                    <thead>
                    <tr>
                        <th>📄 제목</th>
                        <th>🕒 등록일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notices.map((notice) => (
                        <tr key={notice.noticeId} onClick={() => openDetailModal(notice.noticeId)}>
                            <td>{notice.noticeTitle}</td>
                            <td>{new Date(notice.noticeCreatedAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 📜 공지 추가/상세 모달 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeModal}><X size={18} /></span>

                        {/* ✅ 공지 추가 모달 */}
                        {isAddingNotice ? (
                            <div className="notice-add-form">
                                <h2>새 공지 작성</h2>
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
                        ) : (
                            <NoticeDetail noticeId={selectedNoticeId!} closeModal={closeModal} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeComponent;
