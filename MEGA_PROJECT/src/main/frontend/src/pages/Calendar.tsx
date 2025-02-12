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
interface CalendarProps {
    onProjectSelect: (projectId: number) => void; // ✅ 프로젝트 선택 시 실행될 함수
}
const Calendar: React.FC<CalendarProps> = ({ onProjectSelect }) => {
    const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate
    const [currentDate, setCurrentDate] = useState(new Date());
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        api.get("/calendar_project")
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
    const daysArray: { date: Date; isOtherMonth: boolean }[] = [];

    // ✅ 공휴일 데이터 추가
    const holidays: { [key: string]: string } = {
        "01-01": "신정",
        "03-01": "삼일절",
        "05-05": "어린이날",
        "06-06": "현충일",
        "08-15": "광복절",
        "10-03": "개천절",
        "10-09": "한글날",
        "12-25": "크리스마스"
    };

    // ✅ 설날, 추석 (매년 날짜 변동, 음력 계산 필요)
    const lunarHolidays = {
        "2024": { "02-09": "설날 연휴", "02-10": "설날", "02-11": "설날 연휴", "09-16": "추석 연휴", "09-17": "추석", "09-18": "추석 연휴" }
    };

    const year = currentDate.getFullYear();
    if (lunarHolidays[year]) {
        Object.assign(holidays, lunarHolidays[year]);
    }

    for (let i = prevMonthLastDay.getDay(); i >= 0; i--) {
        daysArray.push({ date: new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i), isOtherMonth: true });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        daysArray.push({ date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i), isOtherMonth: false });
    }

    for (let i = 1; daysArray.length % 7 !== 0; i++) {
        daysArray.push({ date: new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth() + 1, i), isOtherMonth: true });
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
                <button onClick={prevMonth} className="calendar-button">&lt;</button>
                <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
                <button onClick={nextMonth} className="calendar-button">&gt;</button>
            </div>
            <div className="calendar-grid">
                {daysArray.map((dayObj, index) => {
                    const { date, isOtherMonth } = dayObj;
                    const projectsForDay = projects.filter(project => {
                        const start = new Date(project.startDate + "T00:00:00");
                        const end = new Date(project.deadline + "T23:59:59");
                        return date >= start && date <= end;
                    });
                    // ✅ 일요일이면 클래스 추가
                    const isSunday = date.getDay() === 0;
                    // ✅ 공휴일인지 확인
                    const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                    console.log("📅 날짜 변환 확인:", date, "→", formattedDate);
                    const isHoliday = holidays[formattedDate] !== undefined;
                    return (
                        <div key={index} className={`calendar-day ${isOtherMonth ? "other-month" : ""} ${isSunday || isHoliday ? "holiday" : ""}`}>
                            {date.getDate()}
                            {isHoliday && <span className="holiday-name">{holidays[formattedDate]}</span>}
                            {projectsForDay.map((project) => (
                                <div key={project.projectId} className="calendar-project-bar"
                                     style={{ backgroundColor: getColorForProject(project.projectId), cursor: "pointer" }}
                                     onClick={() => onProjectSelect(project.projectId)}>
                                    {project.projectName}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Calendar;