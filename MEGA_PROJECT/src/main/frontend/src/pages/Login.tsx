import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // ✅ axios 인스턴스 가져오기
import "./Login.css";

interface FormData {
    user_id: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        user_id: "",
        password: "",
    });
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

            const response = await api.post("/api/login", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            console.log("✅ 로그인 성공:", response.data);
            alert("로그인 성공!");
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                console.error("❌ 로그인 실패 - 상태 코드:", error.response.status);
                console.error("서버 응답:", error.response.data);

                if (error.response.status === 400) {
                    setError("아이디 또는 비밀번호가 잘못되었습니다.");
                } else if (error.response.status === 404) {
                    setError("서버를 찾을 수 없습니다.");
                } else if (error.response.status === 500) {
                    setError("서버 오류가 발생했습니다. 다시 시도하세요.");
                } else {
                    setError(error.response.data?.message || "로그인 실패!");
                }
            } else {
                console.error("❌ 예상치 못한 오류:", error);
                setError("예기치 않은 오류가 발생했습니다!");
            }
        }
    };

    return (
        <div className="auth-container">
            {/* 🎥 배경 비디오 추가 */}
            <div className="video-wrapper">
                <video autoPlay loop muted playsInline className="background-video">
                    <source src="/videos/Spark_main.mp4" type="video/mp4" />
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
