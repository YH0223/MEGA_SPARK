import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App"; // ✅ AuthContext 가져오기
import "./Dashboard.css";

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext)!; // ✅ 전역 상태 사용
  const [userId, setUserId] = useState<string | null>(null); // ✅ 로그인한 사용자 ID 상태

  // ✅ 로그인한 사용자 정보 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      axios.get("http://localhost:8080/api/session", {
        withCredentials: true, // ✅ 세션 유지
      })
          .then(response => {
            console.log("✅ 로그인한 사용자:", response.data);
            setUserId(response.data);
          })
          .catch(error => {
            console.error("❌ 세션 정보를 가져올 수 없음:", error);
            setUserId(null);
          });
    }
  }, [isAuthenticated]);

  return (
      <div className="dashboard-container">
        <nav className="sidebar">
          <h2>from Spark</h2>
          <ul>
            <li className="active">Dashboard</li>
            <li><Link to="/newproject">Projects</Link></li>
            <li>Team</li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li>Promote</li>
            <li>Help</li>
          </ul>
          <div className="sidebar-footer">
            <button className="upgrade-button">Upgrade Spark Trial !!!</button>
            <div className="user-info">
              <img src="https://via.placeholder.com/40" alt="그림" style={{ borderRadius: "50%" }} />
              {/* ✅ 로그인한 사용자 ID 표시 */}
              {userId ? <span>{userId}</span> : <span>Guest</span>}
            </div>
          </div>
        </nav>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Hello {userId || "Guest"} 👋</h1> {/* ✅ 로그인한 사용자 ID 표시 */}
          </header>

          <section className="stats-container">
            <div className="stats-card">
              <h2>Team Members</h2>
              <p>34</p>
              <span className="percentage positive">↑ 16% this month</span>
            </div>
            <div className="stats-card">
              <h2>New Members</h2>
              <p>2</p>
              <span className="percentage negative">↓ 1% this month</span>
            </div>
            <div className="stats-card">
              <h2>Active Now</h2>
              <p>189</p>
            </div>
          </section>

          <section className="table-container">
            <div className="Search">
              <h3>All Projects</h3>
              <input type="text" placeholder="Search" />
            </div>
            <table>
              <thead>
              <tr>
                <th>Project</th>
                <th>Project Manager</th>
                <th>Class</th>
                <th>Email</th>
                <th>Period</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>JAVA SPRING</td>
                <td>Jane Doe</td>
                <td>Web Development</td>
                <td>janedoe@example.com</td>
                <td>Jan 2025 - Jun 2025</td>
                <td className="status-active">In Progress</td>
              </tr>
              </tbody>
            </table>
          </section>

          <div className="pagination">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>...</button>
            <button>40</button>
          </div>
        </main>
      </div>
  );
};

export default Dashboard;
