import React, { useState, useEffect } from "react";
import axios from "axios";
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
    axios.get<Project[]>("/api/calander_project")
        .then(response => setProjects(response.data))
        .catch(error => console.error("프로젝트 데이터를 불러오는 중 오류 발생:", error));
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

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 특정 날짜가 프로젝트 기간에 속하는지 확인
  const getProjectBarsForDate = (date: Date) => {
    return projects
        .filter(project => {
          const start = new Date(project.startdate);
          const end = new Date(project.deadline);
          return date >= start && date <= end;
        })
        .map((project, index) => (
            <div key={project.projectId} className={`bar bar-${index % 3}`} />
        ));
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
              <div key={index} className="calendar-day">
                {day.getDate()}
                <div className="bars-container">
                  {getProjectBarsForDate(day)}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default Calendar;
