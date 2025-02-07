import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ api.tsx에서 설정한 axios 인스턴스를 가져옴
import "./NewProject.css";
import { Link } from "react-router-dom";


const NewProject = () => {
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const navigate = useNavigate(); // ✅ 리다이렉트 함수

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      projectName,
      startdate: startDate,
      deadline,
    };

    try {
      const response = await api.post("/api/createproject", newProject);
      alert("✅ 프로젝트가 생성되었습니다!");

      // ✅ 프로젝트 생성 성공 시 대시보드로 이동
      navigate("/dashboard");
    } catch (error) {
      // @ts-ignore
      if (error.response) {
        // @ts-ignore
        alert(`❌ 프로젝트 생성 실패: ${error.response.data}`);
      } else {
        alert("❌ 프로젝트 생성 중 오류가 발생했습니다.");
      }
    }
  };

  return (
      <div className="dashboard-container">
        <nav className="sidebar">
          <h2>from Spark</h2>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li className="active">New Project</li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
            <li><Link to="/Settings">Settings</Link></li>
          </ul>
        </nav>
        <div className="new-project-container">
          <h2>새 프로젝트 만들기</h2>
          <form onSubmit={handleSubmit} className="new-project-form">
            <label>
              프로젝트 이름:
              <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required/>
            </label>

            <label>
              시작 날짜:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
            </label>

            <label>
              마감 날짜:
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required/>
            </label>

            <button type="submit" className="create-button">프로젝트 생성</button>
          </form>
        </div>
      </div>
  );
};

export default NewProject;
