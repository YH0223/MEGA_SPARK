import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
    user_id: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        user_id: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
    const navigate = useNavigate(); // useNavigate를 컴포넌트 내부로 이동

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log("Sending data:", formData); // 디버깅용 출력

            const response = await axios.post("/api/login", formData); // 로그인 API 요청
            console.log("Success:", response.data);
            alert("Login Successful!");
            navigate("/dashboard"); // 로그인 성공 시 대시보드로 리다이렉트
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Login Failed!");
            } else {
                console.error("Unexpected error:", error);
                setError("An unexpected error occurred!");
            }
        }
    };

    return (
        <div className="auth-container">
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
                        placeholder="USERID"
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
                {error && <p style={{ color: "red" }}>{error}</p>} {/* 오류 메시지 출력 */}
                <Link to="/forgot-password">Forgot Password?</Link>
                <Link to="/register">
                    <button className="register-button">Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Login;
