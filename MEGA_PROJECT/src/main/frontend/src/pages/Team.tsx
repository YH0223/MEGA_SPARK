import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import "./team.css";
import api from "../api";
import { ToastContainer, toast } from "react-toastify"; // ✅ import 추가
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS 추가



const TeamManagement = ({ projectId }: { projectId: number }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const [teamMembers, setTeamMembers] = useState<string[]>([]); // ✅ ID만 저장
    const [searchId, setSearchId] = useState(""); // ✅ 검색할 userId
    const [searchResults, setSearchResults] = useState<string[]>([]); // ✅ 검색 결과 저장
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false); // ✅ 검색창 표시 여부 상태 추가
    const searchRef = useRef<HTMLDivElement>(null); // ✅ 검색창 감지용 ref 추가


    /** ✅ 세션 유지 확인 및 팀원 목록 불러오기 */
    useEffect(() => {
        api.get(`/session`, { withCredentials: true })
            .then(response => {
                console.log("✅ 로그인 유지됨. 사용자:", response.data);
                setIsAuthenticated(true);
                fetchTeamMembers();
            })
            .catch(() => {
                console.log("❌ 로그인 세션 없음");
                setIsAuthenticated(false);
            });
    }, [setIsAuthenticated]);

    /** ✅ 팀원 목록 불러오기 */
    const fetchTeamMembers = async () => {
        try {
            const response = await api.get(`/team/${projectId}`, { withCredentials: true });
            setTeamMembers(response.data.map((member: { userId: string }) => member.userId)); // ✅ userId만 저장
        } catch (error) {
            console.error("❌ 팀원 목록 불러오기 오류:", error);
        }
    };

    /** ✅ 초대 메서드 */
    const sendInvitation = async (inviteeId: string) => {

        if (!inviteeId.trim()) {
            toast.error("❌ 초대할 팀원의 ID를 입력해주세요.", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,

            });
            return;
        }


        try {
            const response = await api.post(
                `/invite`,
                { inviteeId, projectId }, // InvitationDTO 형식에 맞게 데이터 전송
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success("✅ 초대가 전송되었습니다!", {
                    position: "top-center",
                    autoClose: 1300,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                setSearchId(""); // 입력창 초기화
            }
        } catch (error) {
            console.error("❌ 초대 전송 오류:", error);
            if (error && (error as any).response) {
                toast.error(`❌ 초대 전송 실패: ${(error as any).response.data}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            } else {
                toast.error("❌ 초대 전송 실패", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }

        }
    };




    const removeTeamMember = async (userId: string) => {
        if (!window.confirm("이 팀원을 삭제하시겠습니까?")) return;

        try {
            const response = await api.delete(`/deleteteammate`, {
                params: { userId, projectId },  // ✅ `params`에 userId와 projectId 전달
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success("✅ 팀원이 삭제되었습니다!", {
                    position: "top-center",
                    autoClose: 1300,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                fetchTeamMembers();
            }
        } catch (error) {
            console.error("❌ 팀원 삭제 오류:", error);
            if (error && (error as any).response) {
                toast.error(`❌ 팀원 삭제 오류: ${(error as any).response.data}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            } else {
                toast.error("❌ 팀원 삭제 오류", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }

        }
    };


    useEffect(() => {
        if (!searchId.trim()) {
            setSearchResults([]);
            setShowResults(false); // ✅ 입력값이 없으면 검색창 닫기
            return;
        }

        setLoading(true);
        setShowResults(true); // ✅ 검색창 활성화

        const delayDebounceFn = setTimeout(() => {
            api.get(`/searchUsers?query=${searchId}`, { withCredentials: true })
                .then(response => {
                    setSearchResults(response.data.map((user: { userId: string }) => user.userId)); // ✅ userId만 저장
                })
                .catch(error => console.error("❌ 사용자 검색 오류:", error))
                .finally(() => setLoading(false));
        }, 300); // 0.3초 딜레이

        return () => clearTimeout(delayDebounceFn);
    }, [searchId]);


    /** ✅ 바깥 클릭 시 검색 결과 창 닫기 */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false); // ✅ 검색 결과 숨기기
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    if (!isAuthenticated) return <p>세션 확인 중...</p>;

    return (
        <div className="team-container">
            <ToastContainer /> {/* ✅ ToastContainer 추가 */}

            <h1 className="team-title">팀원 관리</h1>

            {/* ✅ 팀원 추가 - ID 입력 */}
            <div className="add-member">
                <input
                    type="text"
                    className="p-2 border rounded w-full"
                    placeholder="추가할 팀원 ID 입력..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onFocus={() => setShowResults(true)} // ✅ 검색창 클릭 시 결과 보이게 설정
                />
                <button onClick={() => sendInvitation(searchId)} className="invite-button">
                    초대하기
                </button>
            </div>

            {/* ✅ 실시간 검색 결과 */}
            {searchResults.length > 0 && (
                <ul className="search-results">
                    {searchResults.map((id) => (
                        <li key={id} onClick={() => setSearchId(id)}>
                            {id}
                        </li>
                    ))}
                </ul>
            )}


            {/* ✅ 팀원 목록 - ID만 출력 */}
            <div className="team-list">
                <h2>등록된 팀원</h2>
                {teamMembers.map((userId) => (
                    <div key={userId} className="team-member">
                        <span>{userId}</span>
                        <button className="remove-button" onClick={() => removeTeamMember(userId)}>삭제</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamManagement;
