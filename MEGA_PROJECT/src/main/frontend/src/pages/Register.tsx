import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import axios from "axios";
import "./Register.css";
import api from "../api";
interface FormData {
  user_id: string;
  password: string;
  user_name: string;
  email_address: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    password: "",
    user_name: "",
    email_address: "",
  });

  const navigate = useNavigate(); // ✅ useNavigate 훅 사용

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Sending data:", formData);
      const response = await api.post("/register", formData);
      console.log("Success:", response.data);
      alert("Registration Successful!");
      navigate("/"); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        if (error.response?.status === 409) {
          alert("User ID already exists! Please choose a different ID.");
        } else {
          alert(error.response?.data?.message || "Registration Failed!");
        }
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred!");
      }
    }
  };


  return (
      <div className="auth-container">
        <div className="auth-left">
          <h1>Spark</h1>
        </div>
        <div className="auth-right">
          <h2>Hello!</h2>
          <p>Sign Up to Get Started</p>
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
            <input
                type="text"
                name="user_name"
                placeholder="Name"
                value={formData.user_name}
                onChange={handleChange}
            />
            <input
                type="email"
                name="email_address"
                placeholder="Email Address"
                value={formData.email_address}
                onChange={handleChange}
            />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
  );
};

export default Register;
