import React, { useState, useEffect } from "react";
import "./Settings.css";
import axios from "axios";
import api from "../api"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
            await api.post("/logout", {}, { withCredentials: true });
            toast.success("✅ 로그아웃합니다!", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                window.location.href = "/"; // ✅ 홈으로 이동/ 약간 지연
            }, 1200);



        } catch (error) {
            if (error && (error as any).response) {
                toast.error(`❌ 로그아웃 실패: ${(error as any).response.data}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            } else {
                toast.error("❌ 로그아웃 실패", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        }

    };

    return (

        <div className="settings-container">
            <ToastContainer /> {/* ✅ ToastContainer 추가 */}

            <h1>설정 페이지</h1>
            <div className="form-group">
                <span className="dark-mode-label">다크 모드:</span>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={handleDarkModeToggle}
                    />
                    <span className="toggle-slider"></span>
                </label>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                로그아웃
            </button>
        </div>
    );
};

export default Settings;
