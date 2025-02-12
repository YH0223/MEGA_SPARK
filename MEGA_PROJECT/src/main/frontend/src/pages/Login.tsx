import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App"; // ✅ AuthContext 가져오기
import "./Login.css";
import api from "../api";
interface FormData {
    user_id: string;
    password: string;
}

const Login: React.FC = () => {
    const { setIsAuthenticated } = useContext(AuthContext)!; // ✅ 전역 상태 사용
    const [formData, setFormData] = useState<FormData>({ user_id: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log("📡 로그인 요청 전송:", formData);

            const response = await api.post("/login", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // ✅ 세션 유지
            });

            console.log("✅ 로그인 성공:", response.data);
            alert("로그인 성공!");

            setIsAuthenticated(true);  // ✅ 전역 로그인 상태 업데이트
            navigate("/dashboard");  // ✅ 자동 리디렉트

        } catch (error) {
            console.error("❌ 로그인 실패:", error);
            setError("아이디 또는 비밀번호가 잘못되었습니다.");
        }
    };

    return (
        <div className="auth-container">
            {/* 🎥 배경 비디오 추가 */}
            <div className="video-wrapper">
                <video autoPlay loop muted playsInline className="background-video">
                    <source src="/videos/Spark_main_4k.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="auth-content">
                <div className="auth-left">
                    <h1>Spark</h1>
                </div>

                <div className="auth-right">
                    <h2>Welcome Back!</h2>
                    <p>Login to your account</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="user_id"
                            placeholder="ID"
                            value={formData.user_id}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button type="submit">Login</button>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <Link to="/register">
                        <button className="register-button">Register</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;