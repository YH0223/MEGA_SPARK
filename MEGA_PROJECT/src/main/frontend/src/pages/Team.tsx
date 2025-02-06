import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import "./team.css";

const API_BASE_URL = "http://localhost:8080/api";

const TeamManagement = ({ projectId }: { projectId: number }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const [teamMembers, setTeamMembers] = useState<string[]>([]); // ✅ ID만 저장
    const [searchId, setSearchId] = useState(""); // ✅ 검색할 userId
    const [loading, setLoading] = useState(false);

    /** ✅ 세션 유지 확인 및 팀원 목록 불러오기 */
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
            });
    }, [setIsAuthenticated]);

    /** ✅ 팀원 목록 불러오기 */
    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/${projectId}`, { withCredentials: true });
            setTeamMembers(response.data.map((member: { userId: string }) => member.userId)); // ✅ userId만 저장
        } catch (error) {
            console.error("❌ 팀원 목록 불러오기 오류:", error);
        }
    };

    /** ✅ 팀원 추가 */
    const addTeamMember = async () => {
        if (!searchId.trim()) {
            alert("추가할 팀원의 ID를 입력해주세요.");
            return;
        }

        if (teamMembers.includes(searchId)) {  // ✅ 중복 체크
            alert("🚨 이미 추가된 팀원입니다!");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/addteammate`,
                { userId: searchId, projectId },
                { withCredentials: true }
            );

            if (response.status === 200) {
                alert("✅ 팀원이 추가되었습니다.");
                setSearchId("");
                fetchTeamMembers();
            }
        } catch (error) {
            console.error("❌ 팀원 추가 오류:", error);
            alert("팀원 추가 중 오류가 발생했습니다.");
        }
    };

    const removeTeamMember = async (userId: string) => {
        if (!window.confirm("이 팀원을 삭제하시겠습니까?")) return;

        try {
            const response = await axios.delete(`${API_BASE_URL}/deleteteammate`, {
                params: { userId, projectId },  // ✅ `params`에 userId와 projectId 전달
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


    if (!isAuthenticated) return <p>세션 확인 중...</p>;

    return (
        <div className="team-container">
            <h1 className="team-title">팀원 관리</h1>

            {/* ✅ 팀원 추가 - ID 입력 */}
            <div className="add-member">
                <input
                    type="text"
                    className="p-2 border rounded w-full"
                    placeholder="추가할 팀원 ID 입력..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button className="add-button" onClick={addTeamMember}>추가</button>
            </div>

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
