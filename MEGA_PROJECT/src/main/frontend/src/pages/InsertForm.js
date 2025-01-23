import React, { useState } from "react";
import axios from "axios";

const InsertForm = () => {
  const [formData, setFormData] = useState({ id: "", password: "", username:"",email:""});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/insert", formData);
      if (response.status === 200) {
        alert("Data inserted successfully!");
        setFormData({ name: "", age: "" });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Failed to insert data.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ID:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>PW:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Insert</button>
    </form>
  );
};

export default InsertForm;
