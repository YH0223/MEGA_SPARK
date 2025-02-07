import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 네비게이션을 위해 추가
import api from "../api";
import "./Calendar.css";

interface Project {
    projectId: number;
    projectName: string;
    startDate: string;
    deadline: string;
}

const Calendar = () => {
    const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate
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

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getColorForProject = (projectId: number) => {
        const colors = ["#ff4d4d", "#4da6ff", "#094333", "#ffcc00", "#cc66ff"];
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
                {daysArray.map((day, index) => {
                    const formattedDate = day.toISOString().split("T")[0];

                    // ✅ 날짜 비교 시 로컬 기준으로 맞추기 위해 startDate를 조정
                    const projectsForDay = projects.filter(project => {
                        const start = new Date(project.startDate + "T00:00:00");  // ✅ 하루 밀리는 문제 해결
                        const end = new Date(project.deadline + "T23:59:59");
                        return day >= start && day <= end;
                    });

                    return (
                        <div key={index} className={`calendar-day ${day.getMonth() !== currentDate.getMonth() ? "calendar-other-month" : ""}`}>
                            {day.getDate()}
                            <div className="project-bars">
                                {projectsForDay.map((project) => (
                                    <div
                                        key={project.projectId}
                                        className="calendar-project-bar"
                                        style={{ backgroundColor: getColorForProject(project.projectId), cursor: "pointer" }} // ✅ 클릭 가능한 UI
                                        onClick={() => navigate(`/project/${project.projectId}`)} // ✅ 클릭 시 이동
                                    >
                                        {project.projectName}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
