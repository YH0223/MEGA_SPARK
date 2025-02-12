import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Project from "./Project"; // ✅ Project.tsx 가져오기
import "./Dashboard.css";
import NewProject from "./NewProject"; // ✅ New Project 페이지 컴포넌트
import Profile from "./Profile"; // ✅ Profile 페이지 컴포넌트
import Calendar from "./Calendar"; // ✅ Calendar 페이지 컴포넌트
import Settings from "./Settings"; // ✅ Settings 페이지 컴포넌트
import { FaPlus, FaCalendarAlt, FaCog, FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight, FaEnvelope, FaChartBar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ✅ 프로젝트 데이터 타입 정의
interface Project {
  projectId: number;
  projectName: string;
  projectManager: string;
  startdate: string;
  deadline: string;
}

interface Invitation {
  invitationId: number;
  projectId: number;
  inviterId: string;
  inviteeId: string;
  status: string;
}
interface ProjectStatus {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
}
interface TaskProgress {
  percentage: number;
  projectId: number;

}

interface UserProfile {
  userName: string;
  img_url: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]); // ✅ 프로젝트 배열로 수정
  const [taskProgress, setTaskProgress] = useState<{ [key: number]: TaskProgress }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]); // ✅ 올바른 타입 적용
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null); // ✅ 선택한 프로젝트 ID
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard"); // ✅ 활성화된 탭 관리

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showInvitationDropdown, setShowInvitationDropdown] = useState(false);


  const [status, setStatus] = useState<ProjectStatus>({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0});
  const [activeFilter, setActiveFilter] = useState<string>("all"); // ✅ 필터 상태 추가
  useEffect(() => {
    fetchUserProfile();
    fetchProjects();
    fetchInvitations();
    fetchProjectStatus();
  }, []);

  const handleNotificationsClick = () => {
    setActiveModal("notifications");
  };

  const fetchInvitations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/invitations", {
        withCredentials: true,
      });
      setInvitations(response.data);
    } catch (error) {
      console.error("🚨 초대 목록 불러오기 오류:", error);
    }
  };


  const declineInvitation = async (invitationId: number) => {
    try {
      await axios.put(
          `http://localhost:8080/api/invite/${invitationId}/decline`,
          {},
          { withCredentials: true }
      );
      alert("✅ 초대를 거절했습니다!");
      setInvitations(invitations.filter((inv) => inv.invitationId !== invitationId));
    } catch (error) {
      console.error("❌ 초대 거절 오류:", error);
      alert("초대 거절 중 오류가 발생했습니다.");
    }
  };

  const acceptInvitation = async (invitationId: number) => {
    try {
      await axios.put(
          `http://localhost:8080/api/invite/${invitationId}/accept`,
          {},
          { withCredentials: true }
      );
      alert("✅ 초대를 수락했습니다!");
      setInvitations(invitations.filter((inv) => inv.invitationId !== invitationId));
    } catch (error) {
      console.error("❌ 초대 수락 오류:", error);
      alert("초대 수락 중 오류가 발생했습니다.");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/profile", { withCredentials: true });
      setUserProfile(response.data);
    } catch (error) {
      console.error("🚨 사용자 프로필 불러오기 오류:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user", { withCredentials: true });
      setProjects(response.data); // ✅ response.data가 Project[]이므로 직접 할당
      response.data.forEach((project: Project) => {
        fetchTaskProgress(project.projectId);
      });
    } catch (error) {
      console.error("🚨 프로젝트 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const fetchTaskProgress = async (projectId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/task/progress/${projectId}`, { withCredentials: true });

      if (typeof response.data.percentage === "number") {
        setTaskProgress(prev => ({
          ...prev,
          [projectId]: response.data.percentage
        }));
      } else {
        setTaskProgress(prev => ({ ...prev, [projectId]: 0 }));
      }
    } catch (error) {
      console.error(`🚨 프로젝트 ${projectId}의 Task 진행률을 불러오는 중 오류 발생:`, error);
      setTaskProgress(prev => ({ ...prev, [projectId]: 0 }));
    }
  };

  const fetchProjectStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/projects/status", { withCredentials: true });
      setStatus(response.data);
    } catch (error) {
      console.error("🚨 프로젝트 상태 데이터를 불러오는 중 오류 발생:", error);
    }
  };


  /** ✅ 프로젝트 진행률 바 그래프 데이터 */
  const progressData = projects.map((project) => ({
    name: project.projectName,
    progress: taskProgress[project.projectId]?.percentage || 0, // 🔥 객체 접근 방식 수정
  }));


  /** ✅ 도넛 차트 데이터 (전체, 진행 중, 완료) */
  const donutData = [
    { name: "진행 중", value: status.inProgressProjects },
    { name: "완료", value: status.completedProjects }
  ];

  /** ✅ 도넛 차트 색상 */
  const COLORS = ["#ffcc00", "#00c49f", "#0088fe"];



  const getStatusColor = (percentage: number) => {
    if (percentage < 33) return "#f44b42";
    if (percentage < 66) return "#f6d122";
    if (percentage < 99) return "#3ef141";
    return "#5395f3";
  };

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setFilteredProjects(
        projects.filter((project) => {
          const progress = taskProgress[project.projectId] ?? 0;

          // ✅ 상태(activeFilter)에 따른 필터링 적용
          if (activeFilter === "inProgress" && progress === 100) return false;
          if (activeFilter === "completed" && progress < 100) return false;

          // ✅ 검색어 필터 적용
          return project.projectName.toLowerCase().includes(searchTerm.toLowerCase());
        })
    );
  }, [searchTerm, projects, activeFilter, taskProgress]); // ✅ activeFilter, taskProgress 추가

  useEffect(() => {
    setFilteredProjects(
        projects.filter((project) =>
            project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) // 🔥 대소문자 무시하고 검색
        )
    );
  }, [searchTerm, projects]); // 🔥 searchTerm과 projects가 변경될 때만 실행


  useEffect(() => {
    fetchUserProfile();
    fetchProjects();
    axios.get("http://localhost:8080/api/projects/status", { withCredentials: true })
        .then(response => {
          console.log("📊 프로젝트 상태 데이터:", response.data);
          setStatus(response.data);
        })
        .catch(error => {
          console.error("🚨 프로젝트 상태 데이터를 불러오는 중 오류 발생:", error);
        });
  }, []);
  /** ✅ 모달 닫기 함수 */
  const closeModal = () => setActiveModal(null);

  /** ✅ 프로젝트 클릭 시 세션 유지한 채로 표시 */
  const handleProjectClick = (projectId: number) => {
    console.log("🔍 선택한 프로젝트 ID:", projectId);
    setSelectedProjectId(projectId);
  };
  /** ✅ Calendar에서 클릭한 프로젝트를 `table-container`에 추가 */
  const handleProjectSelectFromCalendar = (projectId: number) => {
    console.log("📌 캘린더에서 선택된 프로젝트 ID:", projectId);
    setSelectedProjectId(projectId);
    setActiveModal(null); // ✅ 모달 닫기
  };
  const handleProjectCreated = () => {
    console.log("📌 새 프로젝트가 생성되었습니다.");
    setActiveModal(null); // ✅ 모달 닫기
    fetchProjects(); // ✅ 새 프로젝트 추가 후 목록 새로고침
  };

  const handleAddProject = () => {
    console.log("새로운 프로젝트 추가");
    // ✅ 새로운 프로젝트 추가 로직 (예: 모달 열기)
    setActiveModal("newProject");
  };



  const [showProgressChart, setShowProgressChart] = useState(true);
  const [showDonutChart, setShowDonutChart] = useState(true);

  return (
      <div className="dashboard-container">
        {/* ✅ 유저 프로필 추가 */}


        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Hello {userProfile ? userProfile.userName : "Guest"} 👋</h1>
            {/* 📌 Header Right Section */}
            <div className="header-right">
              <div className="profile-section" onClick={() => setActiveModal("profile")}>
                <img src={userProfile?.img_url || "/default_profile.png"} alt="Profile" className="header-profile" />
              </div>
              {showInvitationDropdown && (
                  <div className="invitation-dropdown">
                    <div className="dropdown-header">
                      <h3>초대 목록</h3>
                      <button className="close-button" onClick={() => setShowInvitationDropdown(false)}>×</button>
                    </div>
                    {invitations.length === 0 ? (
                        <p className="empty-message">현재 초대가 없습니다.</p>
                    ) : (
                        <ul className="invitation-list">
                          {invitations.map((invitation) => (
                              <li key={invitation.invitationId} className="invitation-item">
                                <div className="invitation-details">
                                  <p><strong>프로젝트 ID:</strong> {invitation.projectId}</p>
                                  <p><strong>초대자:</strong> {invitation.inviterId}</p>
                                </div>
                                <div className="invitation-actions">
                                  <button className="accept-button" onClick={() => acceptInvitation(invitation.invitationId)}>
                                    수락
                                  </button>
                                  <button className="decline-button" onClick={() => declineInvitation(invitation.invitationId)}>
                                    거절
                                  </button>
                                </div>
                              </li>
                          ))}
                        </ul>
                    )}
                  </div>
              )}
              <button className="icon-button" onClick={() => setShowInvitationDropdown(!showInvitationDropdown)}>
                <FaEnvelope />
                {invitations.length > 0 && <span className="badge">{invitations.length}</span>}
              </button>
              <button className="icon-button" onClick={() => setActiveModal("newProject")}>
                <FaPlus />
              </button>
              <button className="icon-button" onClick={() => setActiveModal("calendar")}>
                <FaCalendarAlt />
              </button>
              <button className="icon-button" onClick={() => setActiveModal("settings")}>
                <FaCog />
              </button>
            </div>
          </header>

          {/* 📊 Charts Section */}
          <div className="charts-container">
            {/* 프로젝트 진행률 바 차트 */}
            <div
                className={`chart-box ${showProgressChart ? "expanded" : "collapsed"}`}
                style={{ flex: showProgressChart ? "1" : "0.05", transition: "flex 0.3s ease-in-out" }}
            >
              <h3 onClick={() => setShowProgressChart(!showProgressChart)}>
                📊 프로젝트 진행률 {showProgressChart ? <FaChevronLeft /> : <FaChevronRight />}
              </h3>



              {/* ✅ Progress Chart (막대 그래프) */}

              {showProgressChart && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={filteredProjects.map((project) => ({
                          name: project.projectName,
                          progress: taskProgress[project.projectId] ?? 0, // 진행률 가져오기
                        }))}
                        layout="vertical"
                    >
                      <XAxis
                          type="number"
                          domain={[0, 100]}
                          tickFormatter={(tick) => `${tick}%`}
                      />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar
                          dataKey="progress"
                          fill="#0088fe"
                          barSize={20}
                          label={{ position: "right", formatter: (value: number) => `${value.toFixed(1)}%`                           }}
                      />


                    </BarChart>

                  </ResponsiveContainer>

              )}
            </div>

            {/* 프로젝트 진행 현황 도넛 차트 */}
            <div
                className={`chart-box ${showDonutChart ? "expanded" : "collapsed"}`}
                style={{ flex: showDonutChart ? "1" : "0.05", transition: "flex 0.3s ease-in-out" }}
            >
              <h3 onClick={() => setShowDonutChart(!showDonutChart)}>
                📌 프로젝트 진행현황 {showDonutChart ? <FaChevronRight /> : <FaChevronLeft />}
              </h3>
              {showDonutChart && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie

                          data={donutData}

                          dataKey="value"

                          nameKey="name"

                          cx="50%"

                          cy="50%"

                          outerRadius={80}

                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}

                      >
                        {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
              )}
            </div>
          </div>


          {/* ✅ 프로젝트 개수 통계 추가 */}

          <div className="stats-container">
            <div
                className={`stats-card total ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
            >
              <h2>📊 전체 프로젝트</h2>
              <p>{status.totalProjects} 개</p>
            </div>

            <div
                className={`stats-card in-progress ${activeFilter === "inProgress" ? "active" : ""}`}
                onClick={() => setActiveFilter("inProgress")}
            >
              <h2>🚀 진행 중</h2>
              <p>{status.inProgressProjects} 개</p>
            </div>

            <div
                className={`stats-card completed ${activeFilter === "completed" ? "active" : ""}`}
                onClick={() => setActiveFilter("completed")}
            >
              <h2>✅ 완료</h2>
              <p>{status.completedProjects} 개</p>
            </div>
          </div>

          <section className="table-container">

            {selectedProjectId ? (
                <>
                  <button className="back-button" onClick={() => setSelectedProjectId(null)}>
                    🔙 Back to Projects
                  </button>
                  <Project projectId={selectedProjectId} />
                </>
            ) : (
                <>
                  <div className="Search">
                    <h3>All Projects</h3>
                    <input type="text" placeholder="Search"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)} // 🔥 입력값으로 searchTerm 상태 업데이트
                    />
                  </div>
                  <table>
                    <thead>
                    <tr>
                      <th>Project</th>
                      <th>Project Manager</th>
                      <th>Start Date</th>
                      <th>Deadline</th>
                      <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProjects.map((project) => {
                      const completion = taskProgress[project.projectId] ?? 0;
                      const statusColor = getStatusColor(completion);

                      return (
                          <tr key={project.projectId} onClick={() => handleProjectClick(project.projectId)} className="clickable-row">
                            <td>{project.projectName}</td>
                            <td>{project.projectManager}</td>
                            <td>{new Date(project.startdate).toLocaleDateString()}</td>
                            <td>{new Date(project.deadline).toLocaleDateString()}</td>
                            <td>
                              <div className="progress-bar-container">
                                <span className="progress-text">{completion.toFixed(0)}%</span>
                                <div className="progress-bar" style={{ width: `${completion}%`, backgroundColor: statusColor }} />
                              </div>
                            </td>
                          </tr>
                      );
                    })}
                    <tr className="add-project-row" onClick={handleAddProject}>
                      <td colSpan="5" className="add-project-cell">
                        <div className="new-project-button">
                          <span className="plus-icon">➕</span>
                          <span className="center-text">New Project</span>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </>
            )}
          </section>
          <footer className="dashboard-footer">
            <p>© 2025 Your Company. All rights reserved. Contact us: support@yourcompany.com</p>
          </footer>
        </main>

        {activeModal && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={closeModal}>&times;</span>
                {activeModal === "newProject" && <NewProject onProjectCreated={handleProjectCreated} />} {/* ✅ 함수 전달 */}
                {activeModal === "profile" && <Profile />}
                {activeModal === "calendar" && <Calendar onProjectSelect={handleProjectSelectFromCalendar} />}
                {activeModal === "settings" && <Settings />}
              </div>
            </div>
        )}
      </div>
  );
};

export default Dashboard;
