import React, { useState, useEffect } from "react";
import api from "../api";
import "./Calendar.css";

interface Project {
    projectId: number;
    projectName: string;
    startdate: string; // "YYYY-MM-DD"
    deadline: string;  // "YYYY-MM-DD"
}

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        api.get("/api/calendar_project")
            .then(response => {
                if (Array.isArray(response.data)) {
                    setProjects(response.data);
                    console.log("✅ 프로젝트 데이터 받아옴:", response.data);
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

    console.log("📌 Days in Calendar:", daysArray.map(d => d.toISOString().split("T")[0]));

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getColorForProject = (projectId: number) => {
        const colors = ["#ff4d4d", "#4da6ff", "#4dff4d", "#ffcc00", "#cc66ff"];
        return colors[projectId % colors.length];
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
                {daysArray.map((day, index) => (
                    <div key={index} className={`calendar-day ${day.getMonth() !== currentDate.getMonth() ? "calendar-other-month" : ""}`}>
                        {day.getDate()}
                    </div>
                ))}

                {projects.map(project => {
                    const start = new Date(project.startdate);
                    const end = new Date(project.deadline);
                    const startDateStr = start.toISOString().split("T")[0];
                    const endDateStr = end.toISOString().split("T")[0];

                    console.log(`📌 프로젝트: ${project.projectName}, 시작: ${startDateStr}, 종료: ${endDateStr}`);

                    const startIndex = daysArray.findIndex(d => d.toISOString().split("T")[0] === startDateStr);
                    const endIndex = daysArray.findIndex(d => d.toISOString().split("T")[0] === endDateStr);

                    console.log(`📌 찾은 Start Index: ${startIndex}, End Index: ${endIndex}`);

                    if (startIndex === -1 || endIndex === -1) return null;

                    return (
                        <div
                            key={project.projectId}
                            className="calendar-project-bar"
                            style={{
                                gridColumn: `${startIndex + 1} / ${endIndex + 2}`,
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
