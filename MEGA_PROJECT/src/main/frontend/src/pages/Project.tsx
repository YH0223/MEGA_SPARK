import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import NoticeComponent from "./NoticeComponent";
import TaskComponent from "./Task";
import TeamManagement from "./Team";
import "./Project.css";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import TaskCalendar from "./TaskCalendar";

interface ProjectProps {
    projectId: number;
}

interface ProjectData {
    projectId: number;
    projectName: string;
    projectManager: string;
    startDate: string;
    deadline: string;
}

const Project: React.FC<ProjectProps> = ({ projectId }) => {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const [project, setProject] = useState<ProjectData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editProjectName, setEditProjectName] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editDeadline, setEditDeadline] = useState("");
    const [activeTab, setActiveTab] = useState("main"); // ✅ 탭 관리
    const [taskStats, setTaskStats] = useState({
        completed: 0,
        todo: 0,
        issue: 0,
        hazard: 0,
    });


    /** ✅ Task 진행 상태 불러오기 */
    useEffect(() => {
        axios.get(`http://localhost:8080/task/task-stats/${projectId}`, { withCredentials: true })
            .then(response => setTaskStats(response.data))
            .catch(() => alert("🚨 Task 진행 상태를 불러오는 중 오류 발생"));
    }, [projectId]);

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
                startDate: editStartDate,
                deadline: editDeadline
            });
            setIsEditing(false); // ✅ 수정 후 모달 닫기
        } catch (error) {
            alert("❌ 프로젝트 수정 권한이 없습니다.");
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
            alert("❌ 프로젝트 삭제 권한이 없습니다.");
        }
    };

    if (!isAuthenticated) return <p>⏳ 세션 확인 중...</p>;
    if (!project) return <p>⏳ 데이터를 불러오는 중...</p>;

    /** ✅ 도넛형 그래프 데이터 */

    const taskChartData = {
        labels: ["완료됨", "ToDo", "Issue", "Hazard"],
        datasets: [
            {
                data: [taskStats.completed, taskStats.todo, taskStats.issue, taskStats.hazard],
                backgroundColor: ["#4CAF50", "#A0A0A0", "#FFC107", "#FF3D00"],
            },
        ],
    };

    return (
        <div className="project-container">

            {/* ✅ 프로젝트 정보 */}

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

                        <div className="button-group">
                            <button className="update-button" onClick={updateProject}>수정 완료</button>
                            <button className="cancel-button" onClick={() => setIsEditing(false)}>취소</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="title">{project.projectName}</h1>
                        <div className="project-info">
                            <p>👤 Project Manager: {project.projectManager}</p>
                            <p>📅 진행 기간: {project.startDate} ~ {project.deadline}</p>
                        </div>
                        <div className="button-group">
                            <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>
                            <button className="delete-button" onClick={deleteProject}>삭제</button>
                        </div>
                    </>
                )}
            </div>


            {/* ✅ 탭 네비게이션 */}
            <div className="tab-navigation">
                <button className={activeTab === "main" ? "active" : ""} onClick={() => setActiveTab("main")}>
                    메인
                </button>
                <button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>
                    Task List
                </button>
                <button className={activeTab === "calendar" ? "active" : ""}
                        onClick={() => setActiveTab("calendar")}>
                    Task Calendar
                </button>
                <button className={activeTab === "team" ? "active" : ""} onClick={() => setActiveTab("team")}>
                    팀원 관리
                </button>
                <button className={activeTab === "team" ? "active" : ""} onClick={() => setActiveTab("notice")}>
                    📢 게시판
                </button>
            </div>

            {/* ✅ 각 탭별 화면 */}
            {activeTab === "main" && (
                <div className="main-tab">
                    <div className="chart-container">
                        <h2>📊 진행 상태</h2>
                        <Doughnut data={taskChartData} />
                    </div>
                    <div className="calendar-container">
                        <h2>📅 진행 중인 Task</h2>
                        <TaskCalendar projectId={projectId} />
                    </div>
                </div>
            )}

            {activeTab === "tasks" && (
                <div className="section">
                    <h2>📝 할 일 목록</h2>
                    <TaskComponent projectId={projectId} />
                </div>
            )}

            {activeTab === "calendar" && (
                <div className="section">
                    <h2>📆 Task 일정</h2>
                    <TaskCalendar projectId={projectId} />
                </div>
            )}

            {activeTab === "team" && (
                <div className="section">
                    <h2>👥 팀원 관리</h2>
                    <TeamManagement projectId={projectId} />
                </div>
            )}

            {activeTab === "notice" && (
                <div className="section">
                    <h2>📢게시판</h2>
                    <NoticeComponent projectId={projectId} />
                </div>
            )}
        </div>
    );
};

export default Project;
