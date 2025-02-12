import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // ✅ import 추가
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS 추가
import "./Register.css";


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
      const response = await axios.post("/api/register", formData);
      toast.success("🎉 회원가입이 완료되었습니다!", {
        position: "top-center",
        autoClose: 1300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("", response.data);
      setTimeout(() => {
        navigate("/"); // 2초 후 로그인 페이지로 이동
      }, 2000);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        if (error.response?.status === 409) {
          toast.error("❌ 이미 존재하는 아이디입니다!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
          });
        } else {
          toast.error(`❌ ${error.response?.data?.message || "❌ 회원가입에 실패하셨습니다!"}`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
          });
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("❌ 회원가입에 실패하셨습니다!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
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
          <ToastContainer /> {/* ✅ ToastContainer 추가 */}
        </div>
      </div>
  );
};

export default Register;
