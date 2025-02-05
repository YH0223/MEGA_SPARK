import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Calendar from "./pages/Calendar";
import NewProject from "./pages/NewProject";

// 🔥 전역 로그인 상태를 관리할 Context 생성
interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | null>(null); // ✅ Context export

// 🔥 로그인 여부에 따라 보호된 페이지를 가로채는 컴포넌트
const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
    const auth = useContext(AuthContext);
    return auth?.isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/api/session", {
            withCredentials: true
        })
            .then(response => {
                console.log("✅ 로그인 유지됨. 사용자:", response.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                console.log("❌ 로그인 세션 없음");
                setIsAuthenticated(false);
            });
    }, [setIsAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <Router>
                <Routes>
                    {/* 인증 관련 페이지 */}
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* 보호된 페이지: 로그인한 사용자만 접근 가능 */}
                    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                    <Route path="/Project" element={<PrivateRoute element={<Project />} />} />
                    <Route path="/Calendar" element={<PrivateRoute element={<Calendar />} />} />
                    <Route path="/NewProject" element={<PrivateRoute element={<NewProject />} />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
