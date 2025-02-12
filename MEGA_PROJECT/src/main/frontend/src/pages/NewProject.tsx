import React, { useState } from "react";
import api from "../api"; // ✅ api.tsx에서 설정한 axios 인스턴스를 가져옴
import { ToastContainer, toast } from "react-toastify"; // ✅ import 추가
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS 추가
import "./NewProject.css";

interface NewProjectProps {
  onProjectCreated: () => void; // ✅ 부모 컴포넌트에서 실행할 함수
}

const NewProject: React.FC<NewProjectProps> = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      projectName,
      startdate: startDate,
      deadline,
    };

    try {
      await api.post("/createproject", newProject);
      console.log("Request successful"); // 요청 성공 여부 확인
      toast.success("✅ 프로젝트가 생성되었습니다!", {
        position: "top-center",
        autoClose: 1300,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        onProjectCreated(); // 약간 지연
      }, 1500);
    } catch (error) {
      if (error && (error as any).response) {
        toast.error(`❌ 프로젝트 생성 실패: ${(error as any).response.data}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error("❌ 프로젝트 생성 실패", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
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
        <ToastContainer /> {/* ✅ ToastContainer 추가 */}
      </div>
  );
};

export default NewProject;
