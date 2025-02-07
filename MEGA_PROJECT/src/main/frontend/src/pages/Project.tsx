import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App"; // ✅ 세션 정보 가져오기
import TaskComponent from "./Task";
import NoticeComponent from "./NoticeComponent";
import TeamManagement from "./Team";
import "./Project.css";

interface ProjectProps {
    projectId: number;
}

interface ProjectData {
    projectId: number;
    projectName: string;
    projectManager: string;
    startdate: string;
    deadline: string;
}

const Project: React.FC<ProjectProps> = ({ projectId }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const [project, setProject] = useState<ProjectData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editProjectName, setEditProjectName] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editDeadline, setEditDeadline] = useState("");

    /** ✅ 세션 유지 확인 */
    useEffect(() => {
        axios.get("http://localhost:8080/api/session", { withCredentials: true })
            .then(response => {
                console.log("✅ 세션 유지됨:", response.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                console.log("❌ 세션 만료됨. 로그인 페이지로 이동 필요.");
                setIsAuthenticated(false);
            });
    }, [setIsAuthenticated]);

    /** ✅ 프로젝트 데이터 불러오기 */
    useEffect(() => {
        if (!projectId) return;

        console.log(`🔍 요청 URL: http://localhost:8080/api/project/${projectId}`);

        axios.get(`http://localhost:8080/api/project/${projectId}`, { withCredentials: true })
            .then(response => {
                console.log("✅ 프로젝트 데이터:", response.data);
                setProject(response.data);
                setEditProjectName(response.data.projectName);
                setEditStartDate(response.data.startdate);
                setEditDeadline(response.data.deadline);
            })
            .catch(error => {
                console.error("🚨 프로젝트 데이터를 불러오는 중 오류 발생:", error);
            });
    }, [projectId]);

    /** ✅ 프로젝트 수정 */
    const updateProject = async () => {
        try {
            await axios.put(`http://localhost:8080/api/project/update/${projectId}`, {
                projectName: editProjectName,
                startdate: editStartDate,
                deadline: editDeadline,
            }, { withCredentials: true });

            alert("✅ 프로젝트가 수정되었습니다.");
            setIsEditing(false);
            setProject({
                ...project!,
                projectName: editProjectName,
                startdate: editStartDate,
                deadline: editDeadline
            });
        } catch (error) {
            console.error("❌ 프로젝트 수정 오류:", error);
            alert("❌ 프로젝트 수정 중 오류가 발생했습니다.");
        }
    };

    /** ✅ 프로젝트 삭제 */
    const deleteProject = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/project/delete/${projectId}`, { withCredentials: true });

            alert("✅ 프로젝트가 삭제되었습니다.");
            window.location.reload(); // 삭제 후 리다이렉트 (대시보드 등으로 이동 가능)
        } catch (error) {
            console.error("❌ 프로젝트 삭제 오류:", error);
            alert("❌ 프로젝트 삭제 중 오류가 발생했습니다.");
        }
    };

    if (!isAuthenticated) return <p>⏳ 세션 확인 중...</p>;
    if (!project) return <p>⏳ 데이터를 불러오는 중...</p>;

    return (
        <div className="project-container">
            <div className="header">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editProjectName}
                            onChange={(e) => setEditProjectName(e.target.value)}
                            className="edit-title-input"
                        />
                        <div className="edit-date">
                            <label>시작 날짜</label>
                            <input
                                type="date"
                                value={editStartDate}
                                onChange={(e) => setEditStartDate(e.target.value)}
                            />
                            <label>마감 날짜</label>
                            <input
                                type="date"
                                value={editDeadline}
                                onChange={(e) => setEditDeadline(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="title">{project.projectName}</h1>
                        <div className="project-info">
                            <p>👤 Project Manager: {project.projectManager}</p>
                            <p>📅 진행 기간: {project.startdate} ~ {project.deadline}</p>
                        </div>
                    </>
                )}
            </div>

            {/* ✅ 프로젝트 수정 및 삭제 버튼 */}
            <div className="project-actions">
                {isEditing ? (
                    <>
                        <button className="update-button" onClick={updateProject}>수정 완료</button>
                        <button className="cancel-button" onClick={() => setIsEditing(false)}>취소</button>
                    </>
                ) : (
                    <>
                        <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>
                        <button className="delete-button" onClick={deleteProject}>삭제</button>
                    </>
                )}
            </div>

            {/* ✅ Notice 기능 */}
            <NoticeComponent projectId={projectId} />

            {/* ✅ Task 기능 */}
            <TaskComponent projectId={projectId} />

            {/* ✅ 팀원 관리 */}
            <TeamManagement projectId={projectId} />
        </div>
    );
};

export default Project;
