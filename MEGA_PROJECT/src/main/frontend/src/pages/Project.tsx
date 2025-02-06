import React, { useEffect, useState } from "react";
import { Bell, FileText, CheckCircle, XCircle, UserPlus, Upload, Plus } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Project.css";

// ✅ 프로젝트 데이터 타입 정의
interface Project {
  projectId: number;
  projectName: string;
  projectManager: string;
  startdate: string;
  deadline: string;
}

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>(); // ✅ URL에서 projectId 가져오기
  const [project, setProject] = useState<Project | null>(null);

  // ✅ 추가 UI 상태들
  const [checklist, setChecklist] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newItem, setNewItem] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ 프로젝트 데이터 불러오기
  useEffect(() => {
    if (!projectId) return;

    console.log(`🔍 요청 URL: http://localhost:8080/api/${projectId}`);

    axios.get(`http://localhost:8080/api/${projectId}`, { withCredentials: true })
        .then(response => {
          console.log("✅ API 응답 데이터:", response.data);
          setProject(response.data);
        })
        .catch(error => {
          console.error("🚨 프로젝트 데이터를 불러오는 중 오류 발생:", error);
        });
  }, [projectId]);

  // ✅ 데이터가 로딩 중일 때 메시지 표시
  if (!project) return <p>⏳ 데이터를 불러오는 중...</p>;

  // ✅ 공지사항 추가 버튼 핸들러
  const handleAddNotice = () => {
    console.log("📢 공지사항 추가 버튼 클릭됨");
    alert("📢 공지사항이 추가되었습니다!");
  };

  return (
      <div className="project-container">
        {/* 🔥 프로젝트 헤더 */}
        <div className="header">
          <h1 className="title">{project.projectName}</h1>
          <div className="project-info">
            <p>👤 Project Manager ID: {project.projectManager}</p>
            <p>📅 프로젝트 진행 기간: {project.startdate} ~ {project.deadline}</p>
          </div>
        </div>

        {/* 📢 공지사항 */}
        <div className="notice-box">
          <div className="notice-header">
            <h2 className="notice-title">📢 공지사항</h2>
            <button className="add-notice-button" onClick={handleAddNotice}>
              <Plus size={18} /> 추가하기
            </button>
          </div>
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
            <button className="add-checklist-button" onClick={() => {
              if (newItem.trim() !== "") {
                setChecklist([...checklist, { id: Date.now(), text: newItem, completed: false }]);
                setNewItem("");
              }
            }}>추가</button>
          </div>
          <div className="checklist-container">
            {checklist.map((item) => (
                <div key={item.id} className="checklist-item">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={item.completed} onChange={() =>
                        setChecklist((prev) =>
                            prev.map((check) => check.id === item.id ? { ...check, completed: !check.completed } : check)
                        )
                    } />
                    <span className={item.completed ? "completed" : ""}>{item.text}</span>
                  </label>
                </div>
            ))}
          </div>
        </div>

        {/* 📂 파일 업로드 */}
        <div className="file-upload-section">
          <h2>자료 업로드</h2>
          <input type="file" multiple onChange={(event) => {
            if (event.target.files) {
              setFiles([...files, ...Array.from(event.target.files)]);
            }
          }} />
          <ul>{files.map((file, index) => (<li key={index}>{file.name}</li>))}</ul>
        </div>

        {/* 👥 팀원 관리 */}
        <div className="team-section">
          <h2>팀원 목록</h2>
          <div className="team-input">
            <input type="text" placeholder="새 팀원 추가..." value={newMember} onChange={(e) => setNewMember(e.target.value)} />
            <button onClick={() => {
              if (newMember.trim() !== "") {
                setTeamMembers([...teamMembers, newMember]);
                setNewMember("");
              }
            }}><UserPlus size={18} /> 추가</button>
          </div>
          <ul className="team-list">
            {teamMembers.map((member, index) => (
                <li key={index}>{member} <button onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))}>❌</button></li>
            ))}
          </ul>
        </div>

        {/* 🎯 프로젝트 수정/삭제 */}
        <div className="project-actions">
          <h2>프로젝트 수정</h2>
          {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="edit-button">수정하기</button>
          ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                alert("프로젝트가 수정되었습니다!");
                setIsEditing(false);
              }} className="update-project-form">
                <div className="action-buttons">
                  <button type="submit" className="update-button">수정 완료</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">취소</button>
                </div>
              </form>
          )}
          <button onClick={() => {
            if (window.confirm("프로젝트를 삭제하시겠습니까?")) {
              alert("프로젝트가 삭제되었습니다!");
            }
          }} className="delete-button">삭제하기</button>
        </div>
      </div>
  );
};

export default ProjectDetails;
