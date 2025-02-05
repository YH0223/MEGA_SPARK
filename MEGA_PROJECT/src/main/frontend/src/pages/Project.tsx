import React, { useState } from "react";
import { Bell, FileText, CheckCircle, XCircle, UserPlus, Upload } from "lucide-react";
import "./Project.css";

interface NoticeData {
  Project: string;
  ProjectManager: string;
  Class: string;
  Email: string;
  Period: string;
  Status: string;
}

const projectData: NoticeData = {
  Project: "PROJECT NAME",
  ProjectManager: "PM name",
  Class: "A",
  Email: "manager@example.com",
  Period: "2024-01-01 ~ 2024-12-31",
  Status: "Active",
};

const ProjectDetails = () => {
  const [projectName, setProjectName] = useState(projectData.Project);
  const [projectManager, setProjectManager] = useState(projectData.ProjectManager);
  const [category, setCategory] = useState(projectData.Class);
  const [email, setEmail] = useState(projectData.Email);
  const [period, setPeriod] = useState(projectData.Period);
  const [status, setStatus] = useState(projectData.Status);
  const [checklist, setChecklist] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newItem, setNewItem] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const addTeamMember = () => {
    if (newMember.trim() !== "") {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember("");
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("프로젝트가 수정되었습니다!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("프로젝트를 삭제하시겠습니까?")) {
      alert("프로젝트가 삭제되었습니다!");
    }
  };

  const addChecklistItem = () => {
    if (newItem.trim() !== "") {
      setChecklist([...checklist, { id: Date.now(), text: newItem, completed: false }]);
      setNewItem("");
    }
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
      <div className="project-container">
        {/* 🔥 프로젝트 헤더 */}
        <div className="header">
          <Bell className="icon" size={26} />
          <h1 className="title">{projectName}</h1>
          <p className="project-info">{projectManager} | {email} | {period}</p>
        </div>
        {/* 📢 공지사항 */}
        <div className="notice-box">
          <h2 className="notice-title">📢 공지사항</h2>
          <table className="project-table">
            <thead>
            <tr>
              <th>📄 제목</th>
              <th>📌 태그</th>
              <th>🕒 등록일</th>
            </tr>
            </thead>
            <tbody>
            {[...Array(2)].map((_, index) => (
                <tr key={index}>
                  <td><FileText size={18} /> 프로젝트 관련 공지 {index + 1}</td>
                  <td>{index % 2 === 0 ? <CheckCircle className="status-active" size={18} /> : <XCircle className="status-inactive" size={18} />}</td>
                  <td>2024-01-{10 + index}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        {/* ✅ 체크리스트 */}
        <div className="checklist-section">
          <h2>체크리스트</h2>
          <div className="checklist-input">
            <input type="text" placeholder="새 체크리스트 추가..." value={newItem} onChange={(e) => setNewItem(e.target.value)} />
            <button onClick={addChecklistItem}>추가</button>
          </div>
          <div className="checklist-container">
            {checklist.map((item) => (
                <div key={item.id} className="checklist-item">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={item.completed} onChange={() => toggleChecklistItem(item.id)} />
                    <span className={item.completed ? "completed" : ""}>{item.text}</span>
                  </label>
                </div>
            ))}
          </div>
        </div>

        {/* 📂 파일 업로드 */}
        <div className="file-upload-section">
          <h2>자료 업로드</h2>
          <input type="file" multiple onChange={handleFileUpload} />
          <ul>{files.map((file, index) => (<li key={index}>{file.name}</li>))}</ul>
        </div>

        {/* 👥 팀원 관리 */}
        <div className="team-section">
          <h2>팀원 목록</h2>
          <div className="team-input">
            <input type="text" placeholder="새 팀원 추가..." value={newMember} onChange={(e) => setNewMember(e.target.value)} />
            <button onClick={addTeamMember}><UserPlus size={18} /> 추가</button>
          </div>
          <ul className="team-list">
            {teamMembers.map((member, index) => (
                <li key={index}>{member} <button onClick={() => removeTeamMember(index)}>❌</button></li>
            ))}
          </ul>
        </div>

        {/* 🎯 프로젝트 수정/삭제 */}
        <div className="project-actions">
          <h2>프로젝트 수정</h2>
          {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="edit-button">수정하기</button>
          ) : (
              <form onSubmit={handleUpdate} className="update-project-form">
                <label> 프로젝트 이름: <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required /></label>
                <label> 프로젝트 관리자: <input type="text" value={projectManager} onChange={(e) => setProjectManager(e.target.value)} required /></label>
                <div className="action-buttons">
                  <button type="submit" className="update-button">수정 완료</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">취소</button>
                </div>
              </form>
          )}
          <button onClick={handleDelete} className="delete-button">삭제하기</button>
        </div>
      </div>
  );
};

export default ProjectDetails;