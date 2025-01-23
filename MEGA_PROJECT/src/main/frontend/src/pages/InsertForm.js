import React, { useState } from "react";
import axios from "axios";

const InsertForm = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    user_name: "",
    password: "",
    email_address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // axios를 사용하여 POST 요청 보내기
      const response = await axios.post("http://localhost:8080/api/insert", formData, {
        headers: {
          "Content-Type": "application/json", // 요청 헤더 설정
        },
      });

      console.log("Response:", response.data); // 서버의 응답 처리
    } catch (error) {
      console.error("Error submitting form:", error); // 에러 처리
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>User ID</label>
        <input
          type="text"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>User Name</label>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          name="email_address"
          value={formData.email_address}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default InsertForm;
