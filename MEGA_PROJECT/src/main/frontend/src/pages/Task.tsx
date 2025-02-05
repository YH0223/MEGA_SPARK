import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Task.css";

interface Task {
    taskId: number;
    taskName: string;
    checking: boolean;
}

const TaskComponent = ({ projectId }: { projectId: number }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/task/${projectId}`);
            console.log("API 응답 데이터:", response.data); // ✅ 데이터가 올바르게 오는지 확인
            setTasks(response.data);
        } catch (error) {
            console.error("Task 데이터를 불러오는 중 오류 발생:", error);
        }
    };

    const addTask = async () => {
        if (!newTask.trim()) return;

        try {
            const requestBody = {
                taskName: newTask,  // ✅ 서버가 기대하는 필드명
                checking: false,
                projectId: projectId
            };

            console.log("🔵 추가 요청 데이터:", requestBody); // ✅ Task 추가 요청 로그 확인

            await axios.post(`/task/create`, requestBody);

            console.log("🟢 Task 추가 성공!"); // ✅ Task가 성공적으로 추가되었는지 확인
            setNewTask(""); // 입력창 초기화

            fetchTasks(); // ✅ 추가 후 목록 새로고침
        } catch (error) {
            console.error("🛑 Task 추가 중 오류 발생:", error);
        }
    };

    const deleteTask = async (taskId: number) => {
        try {
            console.log(`🗑️ 삭제 요청: Task ID ${taskId}`); // ✅ 삭제 요청 로그 확인

            await axios.delete(`/task/delete/${taskId}`);

            console.log(`✅ 삭제 완료: Task ID ${taskId}`); // ✅ 삭제 성공 로그 확인

            setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId)); // ✅ UI 즉시 반영
        } catch (error) {
            console.error(`🛑 삭제 실패: Task ID ${taskId}`, error);
        }
    };

    const toggleTask = async (taskId: number) => {
        try {
            console.log(`🔄 체크 상태 변경 요청: Task ID ${taskId}`);

            await axios.put(`/task/toggle/${taskId}`);

            console.log(`✅ 체크 상태 변경 완료: Task ID ${taskId}`);

            fetchTasks(); // ✅ 목록 새로고침 (UI 업데이트)
        } catch (error) {
            console.error(`🛑 체크 상태 변경 실패: Task ID ${taskId}`, error);
        }
    };


    return (
        <div className="task-container">
            <h2>Task 목록</h2>
            <div className="task-input">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="새 Task 추가..."
                />
                <button onClick={addTask}>추가</button>
            </div>
            <ul className="task-list">
                {tasks.map((task) => {
                    console.log("개별 Task 데이터:", task); // ✅ 개별 Task 데이터 확인
                    return (
                        <li key={task.taskId} className={task.checking ? "completed" : ""}>
                            <input type="checkbox" checked={task.checking} onChange={() => toggleTask(task.taskId)} />
                            <span>{task.taskName}</span> {/* ✅ 여기서 값이 있는지 확인 */}
                            <button onClick={() => deleteTask(task.taskId)}>삭제</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TaskComponent;
