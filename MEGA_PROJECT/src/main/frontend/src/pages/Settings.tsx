import React, { useState, useEffect } from "react";
import "./Settings.css";

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "enabled";
  });

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
  };

  return (
    <div className="settings-container">
      <h1>설정 페이지</h1>
      <div className="form-group">
        <label htmlFor="darkMode">다크 모드:</label>
        <input
          type="checkbox"
          id="darkMode"
          checked={darkMode}
          onChange={handleDarkModeToggle}
        />
      </div>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default Settings;
