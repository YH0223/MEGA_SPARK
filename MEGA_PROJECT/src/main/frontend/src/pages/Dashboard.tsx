import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
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
        <div className="sidebar-footer">
          <button className="upgrade-button">Upgrade Spark Trial !!!</button>
          <div className="user-info">
            <img
              src="https://via.placeholder.com/40"
              alt="그림"
              style={{ borderRadius: "50%" }}
            />
             ID
             Project Spark
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Hello ID 👋</h1>
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
                <td>
                  <div className="progress-container">
                    <div className="progress-bar progress-in-progress">In Progress</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>React Native</td>
                <td>John Smith</td>
                <td>Mobile Development</td>
                <td>johnsmith@example.com</td>
                <td>Feb 2025 - Aug 2025</td>
                <td>
                  <div className="progress-container">
                    <div className="progress-bar progress-completed">Completed</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>AI Model Training</td>
                <td>Lisa Kim</td>
                <td>Machine Learning</td>
                <td>lisakim@example.com</td>
                <td>Mar 2025 - Sep 2025</td>
                <td>
                  <div className="progress-container">
                    <div className="progress-bar progress-pending">Pending</div>
                  </div>
                </td>
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
