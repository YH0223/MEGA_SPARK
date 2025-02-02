import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // ✅ api.ts에서 설정한 axios 인스턴스를 가져옴
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
    const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
    const navigate = useNavigate(); // useNavigate를 컴포넌트 내부로 이동

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log("📡 로그인 요청 전송:", formData);

            // ✅ axios 인스턴스를 사용하여 요청을 보냄
            const response = await api.post("/api/login", formData, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true, // ✅ 세션 유지
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
                    setError("서버를 찾을 수 없습니다. 백엔드를 실행했는지 확인하세요.");
                } else if (error.response.status === 500) {
                    setError("서버 오류가 발생했습니다. 나중에 다시 시도하세요.");
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
