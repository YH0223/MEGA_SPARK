import React, { useState, useEffect } from "react";
import "./Settings.css";
import axios from "axios";
import { Link } from "react-router-dom";

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


    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
            alert("✅ 로그아웃 완료!");
            window.location.href = "/"; // ✅ 홈으로 이동
        } catch (error) {
            console.error("🚨 로그아웃 실패:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <h2>from Spark</h2>
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/newproject">New Project</Link></li>
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/Profile">Profile</Link></li>
                    <li className="active">Settings</li>
                </ul>
            </nav>

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
        </div>
            );
            };

            export default Settings;