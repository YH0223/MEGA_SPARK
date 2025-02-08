import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import NoticeComponent from "./NoticeComponent";
import TaskComponent from "./Task";
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
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const [project, setProject] = useState<ProjectData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editProjectName, setEditProjectName] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editDeadline, setEditDeadline] = useState("");

    /** ✅ 세션 유지 확인 */
    useEffect(() => {
        axios.get("http://localhost:8080/api/session", { withCredentials: true })
            .then(() => setIsAuthenticated(true))
            .catch(() => {
                setIsAuthenticated(false);
                navigate("/");
            });
    }, [setIsAuthenticated]);

    /** ✅ 프로젝트 데이터 불러오기 */
    useEffect(() => {
        if (!projectId) return;

        axios.get(`http://localhost:8080/api/project/${projectId}`, { withCredentials: true })
            .then(response => {
                setProject(response.data);
                setEditProjectName(response.data.projectName);
                setEditStartDate(response.data.startdate);
                setEditDeadline(response.data.deadline);
            })
            .catch(() => alert("🚨 프로젝트 데이터를 불러오는 중 오류 발생"));
    }, [projectId]);

    /** ✅ 프로젝트 수정 */
    const updateProject = async () => {
        try {
            await axios.put(
                `http://localhost:8080/api/updateproject/${projectId}`,
                {
                    projectName: editProjectName,
                    startdate: editStartDate,
                    deadline: editDeadline
                },
                { withCredentials: true }
            );

            alert("✅ 프로젝트가 수정되었습니다.");
            setProject({
                ...project!,
                projectName: editProjectName,
                startdate: editStartDate,
                deadline: editDeadline
            });
            setIsEditing(false); // ✅ 수정 후 모달 닫기
        } catch (error) {
            alert("❌ 프로젝트 업데이트 오류");
        }
    };

    /** ✅ Task 개수 확인 후 프로젝트 삭제 */
    const deleteProject = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/task/count/${projectId}`, { withCredentials: true });
            const taskCount = response.data.taskCount;

            if (taskCount > 0) {
                if (!window.confirm(`⚠️ 현재 ${taskCount}개의 Task가 남아 있습니다.\n정말 삭제하시겠습니까?`)) return;
            } else {
                if (!window.confirm("정말 프로젝트를 삭제하시겠습니까?")) return;
            }

            await axios.post(`http://localhost:8080/api/deleteproject`,
                { projectName: project?.projectName },
                { withCredentials: true }
            );

            alert("✅ 프로젝트가 삭제되었습니다.");
            navigate("/dashboard");
            window.location.reload();
        } catch (error) {
            alert("❌ 프로젝트 삭제 중 오류가 발생했습니다.");
        }
    };

    if (!isAuthenticated) return <p>⏳ 세션 확인 중...</p>;
    if (!project) return <p>⏳ 데이터를 불러오는 중...</p>;

    return (
        <div className="project-container">
            {/* ✅ 프로젝트 정보 */}
            <div className="header">
                <h1 className="title">{project.projectName}</h1>
                <div className="project-info">
                    <p>👤 Project Manager: {project.projectManager}</p>
                    <p>📅 진행 기간: {project.startdate} ~ {project.deadline}</p>
                </div>
                <div className="button-group">
                    <button className="update-button" onClick={() => setIsEditing(true)}>수정</button>
                    <button className="delete-button" onClick={deleteProject}>삭제</button>
                </div>
            </div>

            {/* ✅ 공지사항 */}
            <div className="section">
                <h2>📢 공지사항</h2>
                <NoticeComponent projectId={projectId} />
            </div>

            {/* ✅ Task 관리 */}
            <div className="section">
                <h2>📝 할 일 목록</h2>
                <TaskComponent projectId={projectId} />
            </div>

            {/* ✅ 팀원 관리 */}
            <div className="section">
                <h2>👥 팀원 관리</h2>
                <TeamManagement projectId={projectId} />
            </div>

            {/* ✅ 모달 창 */}
            {isEditing && (
                <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={() => setIsEditing(false)}>&times;</span>
                        <h2>프로젝트 수정</h2>
                        <input
                            type="text"
                            value={editProjectName}
                            onChange={(e) => setEditProjectName(e.target.value)}
                            placeholder="프로젝트명"
                        />
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
                        <div className="button-group">
                            <button className="update-button" onClick={updateProject}>수정 완료</button>
                            <button className="cancel-button" onClick={() => setIsEditing(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Project;
