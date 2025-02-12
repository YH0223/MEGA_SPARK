import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Calendar.css";
import api from "../api";
interface Task {
    taskId: number;
    taskName: string;
    startDate: string;
    deadline: string;
    checking: boolean;
    priority:number;
}

interface CalendarProps {
    projectId: number;
}

const TaskCalendar: React.FC<CalendarProps> = ({ projectId }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);

    // ✅ Task 데이터 가져오기
    useEffect(() => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split("T")[0];
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split("T")[0];

        api.get(`/task/taskcalendar/${projectId}`, {
            params: { start: startOfMonth, end: endOfMonth }
        })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setTasks(response.data);
                    console.log("✅ Task 데이터 받아옴:", response.data);
                } else {
                    console.error("❌ API 응답이 배열이 아님:", response.data);
                    setTasks([]);
                }
            })
            .catch(error => {
                console.error("❌ Task 데이터를 불러오는 중 오류 발생:", error);
                setTasks([]);
            });
    }, [projectId, currentDate]);

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

    const lunarHolidays = {
        "2024": { "02-09": "설날 연휴", "02-10": "설날", "02-11": "설날 연휴", "09-16": "추석 연휴", "09-17": "추석", "09-18": "추석 연휴" }
    };

    const year = currentDate.getFullYear();
    if (lunarHolidays[year]) {
        Object.assign(holidays, lunarHolidays[year]);
    }

    // ✅ 날짜별 달력 생성
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const daysArray: { date: Date; isOtherMonth: boolean }[] = [];

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

    // ✅ Task 완료 여부에 따라 색상 적용
    const getTaskColor = (checking: boolean) => checking ? "#4CAF50" : "#42A5F5"; // ✅ 완료: 초록색, 미완료: 파란색

// ✅ Task 완료 여부에 따라 스타일 적용
    const getTaskStyle = (priority: number) => {
        const priorityColors = [
            { background: "linear-gradient(to right, #A0A0A0, #C0C0C0)" }, // ✅ ToDo (회색)
            { background: "linear-gradient(to right, #FFD700, #FFC107)" }, // ✅ Issue (노란색)
            { background: "linear-gradient(to right, #FF3D00, #D32F2F)" }, // ✅ Hazard (빨간색)
        ];
        return priorityColors[priority] || { backgroundColor: "#42A5F5" }; // 기본값: 파란색
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
                    const currentDay = date.toISOString().split("T")[0];
                    const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                    const isHoliday = holidays[formattedDate] !== undefined;
                    const tasksForDay = tasks.filter(task => {
                        return currentDay >= task.startDate && currentDay <= task.deadline && !task.checking;
                    });


                    return (
                        <div key={index} className={`calendar-day ${isOtherMonth ? "other-month" : ""} ${isHoliday ? "holiday" : ""}`}>
                            {date.getDate()}
                            {isHoliday && <span className="holiday-name">{holidays[formattedDate]}</span>}

                            {tasksForDay.map((task) => (
                                <div
                                    key={task.taskId}
                                    className="calendar-task"
                                    style={{
                                        ...getTaskStyle(task.priority),
                                        minWidth: "80px",
                                        padding: "4px",
                                        borderRadius: "5px",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        marginTop: "4px",
                                        color: "#fff"
                                    }}
                                >
                                    {task.taskName}
                                </div>
                            ))}

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskCalendar