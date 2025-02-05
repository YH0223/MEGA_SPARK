import React, { useState, useEffect } from "react";
import api from "../api"; // ✅ axios 인스턴스
import "./Calendar.css";

interface Project {
    projectId: number;
    projectName: string;
    startdate: string;
    deadline: string;
}

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        api.get("/calendar_project")
            .then(response => {
                if (Array.isArray(response.data)) {
                    setProjects(response.data);
                } else {
                    console.error("❌ API response is not an array:", response.data);
                }
            })
            .catch(error => console.error("❌ Error fetching projects:", error));
    }, []);

    const daysInWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const daysArray: Date[] = [];

    for (let i = prevMonthLastDay.getDay(); i >= 0; i--) {
        daysArray.push(new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i));
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    for (let i = 1; daysArray.length % 7 !== 0; i++) {
        daysArray.push(new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth() + 1, i));
    }

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // ✅ 프로젝트별 색상 지정
    const getColorForProject = (projectId: number) => {
        const colors = ["#ff4d4d", "#4da6ff", "#4dff4d", "#ffcc00", "#cc66ff"];
        return colors[projectId % colors.length]; // 프로젝트 ID에 따라 색상을 순환적으로 할당
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={prevMonth}>&lt;</button>
                <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>
            <div className="calendar-grid">
                {daysInWeek.map((day, index) => (
                    <div key={index} className="calendar-day-header">{day}</div>
                ))}
                {daysArray.map((day, index) => {
                    const formattedDate = day.toISOString().split("T")[0];
                    return (
                        <div key={index} className={`calendar-day ${day.getMonth() !== currentDate.getMonth() ? "calendar-other-month" : ""}`}>
                            {day.getDate()}
                        </div>
                    );
                })}

                {projects.map(project => {
                    const start = new Date(`${project.startdate}T00:00:00`);
                    const end = new Date(`${project.deadline}T23:59:59`);
                    const startIndex = daysArray.findIndex(d => d.toISOString().split("T")[0] === project.startdate);
                    const endIndex = daysArray.findIndex(d => d.toISOString().split("T")[0] === project.deadline);
                    if (startIndex === -1 || endIndex === -1) return null;

                    return (
                        <div
                            key={project.projectId}
                            className="calendar-project-bar"
                            style={{
                                gridColumn: `${startIndex + 1} / ${endIndex + 2}`, // ✅ 프로젝트 시작일부터 종료일까지 바 표시
                                backgroundColor: getColorForProject(project.projectId)
                            }}
                        >
                            {project.projectName}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
