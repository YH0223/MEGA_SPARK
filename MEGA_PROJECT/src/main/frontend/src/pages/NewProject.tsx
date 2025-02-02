import React, { useState } from "react";
import axios from "axios";
import "./NewProject.css";

const NewProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      projectName,
      projectManager,
      startdate: startDate, // Spring에서 받는 필드명과 맞춤
      deadline,
    };

    try {
      const response = await axios.post("/api/createproject", newProject, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      alert("프로젝트가 생성되었습니다!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`프로젝트 생성 실패: ${error.response.data}`);
      } else {
        alert("프로젝트 생성 중 오류가 발생했습니다.");
      }
    }
  };

  return (
      <div className="new-project-container">
        <h2>새 프로젝트 만들기</h2>
        <form onSubmit={handleSubmit} className="new-project-form">
          <label>
            프로젝트 이름:
            <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
          </label>



          <label>
            시작 날짜:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>

          <label>
            마감 날짜:
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </label>

          <button type="submit" className="create-button">프로젝트 생성</button>
        </form>
      </div>
  );
};

export default NewProject;
