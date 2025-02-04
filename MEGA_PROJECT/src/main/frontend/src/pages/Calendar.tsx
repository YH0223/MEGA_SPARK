import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Calendar.css";
import Modal from "./ScheduleDialog"; // ✅ 올바른 import
import { useQuery } from "@tanstack/react-query"; // ✅ 최신 react-query 형식 적용

const fetchProjects = async () => {
  try {
    const { data } = await axios.get("/api/calendar_project");
    console.log("📡 API 응답 데이터:", data); // ✅ 디버깅용 로그 추가
    return data;
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    return [];
  }
};

const holidays2025 = [
  { date: "2025-01-01", name: "신정" },
  { date: "2025-03-01", name: "삼일절" },
  { date: "2025-05-05", name: "어린이날" },
  { date: "2025-08-15", name: "광복절" },
  { date: "2025-10-03", name: "개천절" },
  { date: "2025-10-09", name: "한글날" },
  { date: "2025-12-25", name: "성탄절" },
];

const Calendar = () => {
  console.log("📅 Calendar 컴포넌트 렌더링됨!"); // ✅ 디버깅용 로그 추가

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 최신 `useQuery` 객체 방식 적용
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],  // ✅ queryKey 배열 유지
    queryFn: fetchProjects,  // ✅ queryFn 함수 그대로 넘기기
    staleTime: 1000 * 60 * 5, // ✅ 캐싱 유지 시간 (5분)
    cacheTime: 1000 * 60 * 10, // ✅ 캐시 삭제 시간 (10분)
  });

  const today = new Date();

  // 🔥 날짜 배열을 `useMemo`로 최적화 (불필요한 계산 방지)
  const daysArray = useMemo(() => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const newDaysArray: Date[] = [];

    for (let i = prevMonthLastDay.getDay(); i >= 0; i--) {
      newDaysArray.push(new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i));
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      newDaysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    for (let i = 1; newDaysArray.length % 7 !== 0; i++) {
      newDaysArray.push(new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth() + 1, i));
    }

    return newDaysArray;
  }, [currentDate]);

  const getHolidayForDate = (date: Date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return holidays2025.find(holiday => holiday.date === formattedDate);
  };


  const openModal = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>&lt;</button>
        <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>&gt;</button>
      </div>

      {isLoading ? (
        <div className="loading">📅 로딩 중...</div>
      ) : (
        <div className="calendar-grid">
          {daysArray.map((day, index) => {
            const isOtherMonth = day.getMonth() !== currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            const holiday = getHolidayForDate(day);

            return (
              <div
                key={index}
                className={`calendar-day ${isOtherMonth ? "other-month" : ""} ${isToday ? "today" : ""} ${holiday ? "holiday" : ""}`}
                title={holiday ? holiday.name : ""}
                onClick={() => openModal(day)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && selectedDate && (
        <Modal date={selectedDate} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Calendar;