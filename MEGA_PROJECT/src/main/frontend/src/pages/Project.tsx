import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // ✅ import 추가
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS 추가
import ConfirmModal from "./ConfirmModal";
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
    startdate: string;
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

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [taskCount, setTaskCount] = useState(0); // Task 수를 저장할 state

    const [editDeadline, setEditDeadline] = useState("");
    const [activeTab, setActiveTab] = useState("main"); // ✅ 탭 관리
    const [taskStats, setTaskStats] = useState({
        completed: 0,
        todo: 0,
        issue: 0,
        hazard: 0,
    });
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null); //수정 모달

    
    

    /** ✅ Task 진행 상태 불러오기 */
    useEffect(() => {
        axios.get(`http://localhost:8080/task/task-stats/${projectId}`, { withCredentials: true })
            .then(response => setTaskStats(response.data))
            .catch(() => toast.success("🚨 Task 진행 상태를 불러오는 중 오류 발생"));
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
            .catch(() => toast.success("🚨 프로젝트 데이터를 불러오는 중 오류 발생"));
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

            toast.success("✅ 프로젝트가 수정되었습니다!", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "230px" }, // ✅ 고정된 가로 크기
            });
            setProject({
                ...project!,
                projectName: editProjectName,
                startdate: editStartDate,
                deadline: editDeadline
            });
            setIsEditing(false); // ✅ 수정 후 모달 닫기
        } catch (error) {
            toast.success("❌ 프로젝트 수정 권한이 없습니다", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "290px" }, // ✅ 고정된 가로 크기
            });
        }
    };

    const handleUpdateProject = async () => {
        if (!selectedProject) return;

        try {
            await axios.put(
                `http://localhost:8080/api/updateproject/${projectId}`,
                selectedProject,
                { withCredentials: true }
            );

            toast.success("✅ 프로젝트가 수정되었습니다!", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "260px" }, // ✅ 고정된 가로 크기
            });
            setProject(selectedProject);
            setEditModalOpen(false);
        } catch (error) {
            toast.success("❌ 프로젝트 수정 권한이 없습니다", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "290px" }, // ✅ 고정된 가로 크기
            });
        }
    };



    const openEditModal = () => {
        setSelectedProject(project);
        setEditModalOpen(true);
    };


    /** ✅ Task 개수 확인 후 프로젝트 삭제 모달 표시 */
    const deleteProject = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/task/count/${projectId}`, { withCredentials: true });
            setTaskCount(response.data.taskCount);
            setIsConfirmModalOpen(true); // ✅ 모달 열기
        } catch (error) {
            toast.error("❌ 프로젝트 삭제 권한이 없습니다", { position: "top-center" });
        }
    };

    /** ✅ 사용자가 모달에서 확인을 누를 때 프로젝트 삭제 */
    const deleteProjectConfirmed = async () => {
        try {
            await axios.post(
                `http://localhost:8080/api/deleteproject`,
                { projectName: project?.projectName },
                { withCredentials: true }
            );

            toast.success("✅ 프로젝트가 삭제되었습니다!", {
                position: "top-center",
                autoClose: 1300,
            });

            setTimeout(() => {
                navigate("/dashboard");
                window.location.reload();
            }, 2000);
        } catch (error) {
            toast.error("❌ 프로젝트 삭제 중 오류가 발생했습니다", { position: "top-center" });
        } finally {
            setIsConfirmModalOpen(false); // ✅ 모달 닫기
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
                            <p>📅 진행 기간: {project.startdate} ~ {project.deadline}</p>
                        </div>
                        <div className="button-group">
                            <button className="edit-button" onClick={openEditModal}>수정</button>
                            <button className="delete-button" onClick={deleteProject}>삭제</button>
                        </div>
                    </>
                )}
            </div>

            {isEditModalOpen && selectedProject && (
                <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>프로젝트 수정</h2>
                        <label>프로젝트 이름</label>
                        <input
                            type="text"
                            value={selectedProject.projectName}
                            onChange={(e) => setSelectedProject({ ...selectedProject, projectName: e.target.value })}
                        />
                        <label>시작 날짜</label>
                        <input
                            type="date"
                            value={selectedProject.startdate}
                            onChange={(e) => setSelectedProject({ ...selectedProject, startdate: e.target.value })}
                        />
                        <label>마감 날짜</label>
                        <input
                            type="date"
                            value={selectedProject.deadline}
                            onChange={(e) => setSelectedProject({ ...selectedProject, deadline: e.target.value })}
                        />
                        <div className="button-group">
                            <button onClick={handleUpdateProject}>수정</button>
                            <button onClick={() => setEditModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}


            <ConfirmModal
                isOpen={isConfirmModalOpen}
                message={
                    taskCount > 0
                        ? `⚠️ 현재 ${taskCount}개의 Task가 남아 있습니다. 정말 삭제하시겠습니까?`
                        : "정말 프로젝트를 삭제하시겠습니까?"
                }
                onConfirm={deleteProjectConfirmed}
                onCancel={() => setIsConfirmModalOpen(false)}
            />

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
                <button className={activeTab === "notice" ? "active" : ""} onClick={() => setActiveTab("notice")}>
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
