import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

interface Project {
  projectId: number;
  projectName: string;
  projectManager: string;
  startdate: string;
  deadline: string;
}

interface TaskProgress {
  percentage: number;
}

interface UserProfile {
  userName: string;
  img_url: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskProgress, setTaskProgress] = useState<{ [key: number]: TaskProgress }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchProjects();
  }, []);

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
      setProjects(response.data);

      // ✅ 각 프로젝트의 Task 진행률 불러오기
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
        console.error(`🚨 잘못된 데이터 형식:`, response.data);
        setTaskProgress(prev => ({ ...prev, [projectId]: 0 }));
      }
    } catch (error) {
      console.error(`🚨 프로젝트 ${projectId}의 Task 진행률을 불러오는 중 오류 발생:`, error);
      setTaskProgress(prev => ({ ...prev, [projectId]: 0 }));
    }
  };

  /** ✅ 상태 색상 결정 함수 */
  const getStatusColor = (percentage: number) => {
    if (percentage < 33) return "#f44b42";  // 빨간색
    if (percentage < 66) return "#f6d122";  // 노란색
    if (percentage < 99) return "#3ef141";  // 초록색
    return "#5395f3";  // 파란색 (100%)
  };

  useEffect(() => {
    setFilteredProjects(
        projects.filter((project) =>
            project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, projects]);

  return (
      <div className="dashboard-container">
        {/* ✅ 유저 프로필 추가 */}
        <nav className="sidebar">
          <div className="user-profile">
            {userProfile && (
                <>
                  <img
                      src={userProfile.img_url ? `http://localhost:8080${userProfile.img_url}` : "/default_profile.png"}
                      alt="Profile"
                      className="user-avatar"
                  />
                  <span className="user-name">{userProfile.userName}</span>
                </>
            )}
          </div>
          <h2>from Spark</h2>
          <ul>
            <li className="active">Dashboard</li>
            <li><Link to="/newproject">New Project</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
            <li><Link to="/Settings">Settings</Link></li>
          </ul>
        </nav>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Hello {userProfile ? userProfile.userName : "Guest"} 👋</h1>
          </header>

          <section className="table-container">
            <h3>All Projects</h3>
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
                    <tr key={project.projectId} onClick={() => navigate(`/project/${project.projectId}`)}
                        className="clickable-row">
                      <td>{project.projectName}</td>
                      <td>{project.projectManager}</td>
                      <td>{new Date(project.startdate).toLocaleDateString()}</td>
                      <td>{new Date(project.deadline).toLocaleDateString()}</td>
                      <td>
                        <div className="progress-bar-container">
                          <span className="progress-text">{completion.toFixed(0)}%</span>
                          <div
                              className="progress-bar"
                              style={{width: `${completion}%`, backgroundColor: statusColor}}
                          />
                        </div>
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </section>
        </main>
      </div>
  );
};

export default Dashboard;
