import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import "./Settings.css";

const Settings: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem("darkMode") === "enabled";
    });

    const navigate = useNavigate();

    /** ✅ 다크 모드 토글 */
    const handleDarkModeToggle = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            document.body.classList.toggle("dark-mode", newMode);
            localStorage.setItem("darkMode", newMode ? "enabled" : "disabled");
            return newMode;
        });
    };

    /** ✅ 로컬 스토리지 값이 변경될 때 적용 */
    useEffect(() => {
        const isDarkMode = localStorage.getItem("darkMode") === "enabled";
        setDarkMode(isDarkMode);
        document.body.classList.toggle("dark-mode", isDarkMode);
    }, []);

    /** ✅ 로그아웃 */
    const handleLogout = () => {
        alert("로그아웃 되었습니다.");
        navigate("/");
    };

    return (
        <div className="settings-container">
            <h1>설정 페이지</h1>

            {/* 🌙 다크 모드 토글 */}
            <div className="form-group">
                <label htmlFor="darkMode">다크 모드:</label>
                <div className="toggle-container" onClick={handleDarkModeToggle}>
                    <div className={`toggle-circle ${darkMode ? "active" : ""}`}>
                        {darkMode ? <Moon size={24} color="white" /> : <Sun size={24} color="yellow" />}
                    </div>
                </div>
            </div>

            {/* 🏆 버튼 그룹 */}
            <div className="button-group">
                <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
                    대시보드로 이동
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default Settings;
