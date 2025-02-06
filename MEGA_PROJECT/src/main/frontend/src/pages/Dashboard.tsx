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

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskProgress, setTaskProgress] = useState<{ [key: number]: TaskProgress }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserId();
    fetchProjects();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/session", { withCredentials: true });
      console.log("✅ 로그인된 사용자 ID:", response.data);
      setUserId(response.data);
    } catch (error) {
      console.error("🚨 사용자 ID 불러오기 오류:", error);
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

  const [, forceRender] = useState(0); // ✅ 강제 리렌더링 트리거

  const fetchTaskProgress = async (projectId: number) => {
    console.log(`📢 요청 보냄: http://localhost:8080/task/progress/${projectId}`);
    try {
      const response = await axios.get(`http://localhost:8080/task/progress/${projectId}`, { withCredentials: true });
      console.log(`✅ 응답 받음:`, response.data);

      if (typeof response.data.percentage === "number") {
        setTaskProgress(prev => {
          const updatedProgress = { ...prev, [projectId]: response.data.percentage };
          forceRender((n) => n + 1);  // ✅ 상태 업데이트 후 강제 리렌더링
          return updatedProgress;
        });
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
        <nav className="sidebar">
          <h2>from Spark</h2>
          <ul>
            <li className="active">Dashboard</li>
            <li><Link to="/newproject">New Project</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
            <li><Link to="/Settings">Settings</Link></li>
          </ul>
        </nav>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Hello {userId ? userId : "Guest"} 👋</h1>
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
                const completion = taskProgress[project.projectId] ?? 0;  // ✅ undefined 방지
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
                          {/* ✅ 중앙 정렬된 퍼센트 표시 */}
                          <span className="progress-text">{completion.toFixed(0)}%</span>

                          {/* ✅ 진행 상태 바 */}
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
