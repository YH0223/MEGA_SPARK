import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
  const navigate = useNavigate();

  // 로그인 처리 함수
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 이메일과 비밀번호 검증 (여기서는 예시로 간단하게 처리)
    if (email === "admin@example.com" && password === "password123") {
      setError(null); // 에러 초기화
      navigate("/dashboard"); // 로그인 성공 시 대시보드로 이동
    } else {
      setError("Invalid email or password."); // 실패 시 에러 메시지 설정
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Spark</h1>
      </div>
      <div className="auth-right">
        <h2>Hello Again!</h2>
        <p>Welcome Back</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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