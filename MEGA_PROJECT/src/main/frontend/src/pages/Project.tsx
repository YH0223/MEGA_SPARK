import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import NoticeComponent from "./NoticeComponent";
import TaskComponent from "./Task";
import TeamManagement from "./Team";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./Project.css";
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
    const [activeTab, setActiveTab] = useState("main"); // ✅ 탭 관리
    const [taskStats, setTaskStats] = useState({
        completed: 0,
        todo: 0,
        issue: 0,
        hazard: 0,
    });

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
            .then(response => setProject(response.data))
            .catch(() => alert("🚨 프로젝트 데이터를 불러오는 중 오류 발생"));
    }, [projectId]);

    /** ✅ Task 진행 상태 불러오기 */
    useEffect(() => {
        axios.get(`http://localhost:8080/task/task-stats/${projectId}`, { withCredentials: true })
            .then(response => setTaskStats(response.data))
            .catch(() => alert("🚨 Task 진행 상태를 불러오는 중 오류 발생"));
    }, [projectId]);

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
                <div className="project-info">
                    <p>👤 Project Manager: {project.projectManager}</p>

                    <p>📅 진행 기간: {project.startDate} ~ {project.deadline}</p>

                    <p>📅 {project.startdate} ~ {project.deadline}</p>

                </div>
                <h1 className="title">{project.projectName}</h1>
                <div className="button-group">
                    <button className="update-button">수정</button>
                    <button className="delete-button">삭제</button>
                </div>
            </div>

            {/* ✅ 탭 네비게이션 */}
            <div className="tab-navigation">
                <button className={activeTab === "main" ? "active" : ""} onClick={() => setActiveTab("main")}>
                    메인
                </button>
                <button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>
                    Task List
                </button>
                <button className={activeTab === "calendar" ? "active" : ""} onClick={() => setActiveTab("calendar")}>
                    Task Calendar
                </button>
                <button className={activeTab === "team" ? "active" : ""} onClick={() => setActiveTab("team")}>
                    팀원 관리
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

            {/* ✅ 공지사항 */}
            <div className="section">
                <h2>📢 공지사항</h2>
                <NoticeComponent projectId={projectId}/>
            </div>

            {/* ✅ Task 관리 */}
            <div className="section">
                <h2>📝 할 일 목록</h2>
                <TaskComponent projectId={projectId}/>
            </div>


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
        </div>
    );
};

export default Project;
