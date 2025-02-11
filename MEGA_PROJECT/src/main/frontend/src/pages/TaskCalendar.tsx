import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Calendar.css";

interface Task {
    taskId: number;
    taskName: string;
    startDate: string;
    deadline: string;
    checking: boolean;
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

        axios.get(`http://localhost:8080/task/taskcalendar/${projectId}`, {
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

    // ✅ 날짜별 달력 생성
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

    // ✅ Task 완료 여부에 따라 색상 적용
    const getTaskColor = (checking: boolean) => checking ? "#4CAF50" : "#007BFF"; // ✅ 완료: 초록색, 미완료: 파란색

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={prevMonth}>&lt;</button>
                <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>

            <div className="calendar-grid">
                {daysArray.map((day, index) => {
                    const currentDay = day.toISOString().split("T")[0];

                    // 🚨 `tasks?.filter(...)`로 변경하여 `tasks`가 `undefined`일 경우 오류 방지
                    const tasksForDay = tasks.filter(task => {
                        return currentDay >= task.startDate && currentDay <= task.deadline;
                    });

                    return (
                        <div key={index} className="calendar-day">
                            {day.getDate()}

                            {/* ✅ Task 일정 표시 */}
                            {tasksForDay.map((task) => (
                                <div key={task.taskId} className="calendar-task"
                                     style={{
                                         backgroundColor: getTaskColor(task.checking),
                                         minWidth: "80px",
                                         padding: "4px",
                                         borderRadius: "5px",
                                         fontSize: "12px",
                                         textAlign: "center",
                                         marginTop: "4px"
                                     }}>
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

export default TaskCalendar;
