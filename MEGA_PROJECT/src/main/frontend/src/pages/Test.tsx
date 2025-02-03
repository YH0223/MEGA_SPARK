import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectManagement = () => {
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [projectId, setProjectId] = useState<number>(0);
  const [userId, setUserId] = useState("");
  const [currentUser, setCurrentUser] = useState("");  // Current user for teammate actions
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = "http://localhost:8080/api";  // Change this URL to your backend API

  // 프로젝트 생성 함수
  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/createproject`, {
        project_name: projectName,
        startdate: startDate,
        deadline: deadline,
      });
      if (response.status === 200) {
        setMessage("Project created successfully!");
        setError(null);
      }
    } catch (err: any) {
      setMessage(null);
      setError("Failed to create project.");
    }
  };

  // 팀원 추가 함수
  const addTeammate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/addteammate`, {
        user_id: userId,
        project_id: projectId,
      });
      if (response.status === 200) {
        setMessage("Teammate added successfully!");
        setError(null);
      }
    } catch (err: any) {
      setMessage(null);
      setError("Failed to add teammate.");
    }
  };

  // 팀원 삭제 함수
  const deleteTeammate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/deleteteammate`, {
        user_id: userId,
        project_id: projectId,
        current_user: currentUser, // Assuming the current user is the project manager
      });
      if (response.status === 200) {
        setMessage("Teammate deleted successfully!");
        setError(null);
      }
    } catch (err: any) {
      setMessage(null);
      setError("Failed to delete teammate.");
    }
  };

  // 프로젝트 삭제 함수
  const deleteProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/deleteproject`, {
        project_name: projectName,
        project_manager: currentUser, // Assuming currentUser is set as the project manager
      });
      if (response.status === 200) {
        setMessage("Project deleted successfully!");
        setError(null);
        navigate("/dashboard"); // Redirect to dashboard after deletion
      }
    } catch (err: any) {
      setMessage(null);
      setError("Failed to delete project.");
    }
  };

  return (
    <div className="project-management-container">
      <h1>Project Management</h1>

      {/* 프로젝트 생성 */}
      <form onSubmit={createProject}>
        <h2>Create Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button type="submit">Create Project</button>
      </form>

      {/* 팀원 추가 */}
      <form onSubmit={addTeammate}>
        <h2>Add Teammate</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(Number(e.target.value))}
        />
        <button type="submit">Add Teammate</button>
      </form>

      {/* 팀원 삭제 */}
      <form onSubmit={deleteTeammate}>
        <h2>Delete Teammate</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Current User (Project Manager)"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        />
        <button type="submit">Delete Teammate</button>
      </form>

      {/* 프로젝트 삭제 */}
      <form onSubmit={deleteProject}>
        <h2>Delete Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Current User (Project Manager)"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        />
        <button type="submit">Delete Project</button>
      </form>

      {/* 메시지 출력 */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProjectManagement;
