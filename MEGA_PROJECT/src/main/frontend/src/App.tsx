import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import ProjectCard from './components/ProjectCard/ProjectCard';
import './App.css';

// 데이터 타입 정의
interface Post {
  id: number;
  title: string;
}

const Dashboard = () => {
  const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts") // 샘플 API
      .then((response) => {
        console.log("Data fetched:", response.data);
        setData(response.data); // 데이터 상태 업데이트
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="project-container">
          {data.slice(0, 5).map((post) => ( // 상위 5개 게시물만 표시
            <ProjectCard
            key={post.id}
            projectName="JAVA SPRING" // 예시 값
            projectManager="Jane Doe" // 예시 값
            email="janedoe@example.com" // 예시 값
            className="Web Development" // 예시 값
            status="In Progress" // 예시 값
            period="Jan 2025 - Jun 2025" // 예시 값
          />
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 인증 관련 페이지 */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* 대시보드 페이지 */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;