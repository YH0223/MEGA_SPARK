import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, UserPlus, Users, Trash2 } from "lucide-react";
import { AuthContext } from "../App"; // ✅ AuthContext 가져오기
import "./team.css";

// ✅ 백엔드 API URL 설정
const API_BASE_URL = "http://localhost:8080/api";

const TeamManagement = ({ projectId }: { projectId: number }) => {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const [search, setSearch] = useState("");
    const [teamMembers, setTeamMembers] = useState<{ userId: string; projectManager: string; projectName: string }[]>([]);
    const [userResults, setUserResults] = useState<{ userId: string; userName: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const [newMember, setNewMember] = useState({ userId: "", projectManager: "", projectName: "" });
    const [newUserResults, setNewUserResults] = useState<{ userId: string; userName: string }[]>([]);
    const [newLoading, setNewLoading] = useState(false);
    const [showNewResults, setShowNewResults] = useState(false);
    const newSearchRef = useRef<HTMLDivElement>(null);

    /** ✅ 세션 유지 확인 */
    useEffect(() => {
        axios.get(`${API_BASE_URL}/session`, { withCredentials: true })
            .then(response => {
                console.log("✅ 로그인 유지됨. 사용자:", response.data);
                setIsAuthenticated(true);
                fetchTeamMembers();
            })
            .catch(() => {
                console.log("❌ 로그인 세션 없음");
                setIsAuthenticated(false);
                navigate("/");
            });
    }, [setIsAuthenticated, navigate]);

    /** ✅ 팀원 목록 불러오기 */
    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/${projectId}`, { withCredentials: true });
            setTeamMembers(response.data);
        } catch (error) {
            console.error("❌ 팀원 목록 불러오기 오류:", error);
        }
    };

    /** ✅ 기존 팀원 검색 (자동완성) */
    useEffect(() => {
        if (!search.trim()) {
            setUserResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            searchUsers(search, setUserResults, setLoading, setShowResults);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    /** ✅ 새 팀원 추가 시 사용자 검색 (자동완성) */
    useEffect(() => {
        if (!newMember.userId.trim()) {
            setNewUserResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            searchUsers(newMember.userId, setNewUserResults, setNewLoading, setShowNewResults);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [newMember.userId]);

    const searchUsers = async (query: string, setResults: any, setLoading: any, setShow: any) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/users?search=${query}`, { withCredentials: true });
            setResults(response.data);
            setShow(true);
        } catch (error) {
            console.error("❌ 사용자 검색 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    /** ✅ 팀원 추가 */
    const addTeamMember = async () => {
        if (!newMember.userId) {
            alert("추가할 팀원의 정보를 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/addteammate`,
                {
                    userId: newMember.userId,
                    projectId,
                    projectManager: newMember.projectManager,
                    projectName: newMember.projectName
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                alert("✅ 팀원이 추가되었습니다.");
                setNewMember({ userId: "", projectManager: "", projectName: "" });
                setShowNewResults(false);
                fetchTeamMembers();
            }
        } catch (error) {
            console.error("❌ 팀원 추가 오류:", error);
            alert("팀원 추가 중 오류가 발생했습니다.");
        }
    };

    /** ✅ 팀원 삭제 */
    const removeTeamMember = async (userId: string) => {
        if (!window.confirm("이 팀원을 삭제하시겠습니까?")) return;

        try {
            const response = await axios.delete(`${API_BASE_URL}/deleteteammate`, {
                data: { userId, projectId },
                withCredentials: true
            });

            if (response.status === 200) {
                alert("✅ 팀원이 삭제되었습니다.");
                fetchTeamMembers();
            }
        } catch (error) {
            console.error("❌ 팀원 삭제 오류:", error);
            alert("팀원 삭제 중 오류가 발생했습니다.");
        }
    };

    /** ✅ 외부 클릭 시 검색 결과 숨기기 */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
            if (newSearchRef.current && !newSearchRef.current.contains(event.target as Node)) {
                setShowNewResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isAuthenticated) return <p>세션 확인 중...</p>;

    return (
        <div className="team-container p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-xl font-bold mb-4 flex items-center">
                <Users className="mr-2" size={24} /> 팀원 관리
            </h1>

            {/* 📌 팀원 추가 - 자동완성 포함 */}
            <div ref={newSearchRef} className="add-member mb-6 relative">
                <h2 className="text-lg font-semibold mb-2">새 팀원 추가</h2>
                <div className="relative flex gap-2">
                    <input
                        type="text"
                        className="p-2 border rounded w-full"
                        placeholder="팀원 이름 검색..."
                        value={newMember.userId}
                        onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
                        onFocus={() => setShowNewResults(true)}
                    />
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={addTeamMember}>
                        <UserPlus size={18} className="inline-block mr-1" /> 추가
                    </button>
                </div>
            </div>

            {/* 📌 팀원 목록 */}
            <div className="team-list">
                <h2 className="text-lg font-semibold mb-2">등록된 팀원</h2>
                {teamMembers.map((member) => (
                    <div key={member.userId} className="flex justify-between items-center p-2 border-b">
                        <div>
                            <p className="font-medium">{member.userId}</p>
                            <p className="text-sm text-gray-500">PM: {member.projectManager}</p>
                            <p className="text-sm text-gray-600">프로젝트: {member.projectName}</p>
                        </div>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => removeTeamMember(member.userId)}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamManagement;
