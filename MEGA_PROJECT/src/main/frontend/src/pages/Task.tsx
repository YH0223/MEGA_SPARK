import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App"; // ✅ AuthContext 가져오기
import "./Task.css";
import api from "../api";
// ✅ Axios 기본 설정: 세션 유지
axios.defaults.withCredentials = true;

interface Task {
    taskId: number;
    taskName: string;
    checking: boolean;
}

const TaskComponent = ({ projectId }: { projectId: number }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const navigate = useNavigate();

    /** ✅ 세션 유지 확인 */
    useEffect(() => {
        axios.get("http://localhost:8080/api/session")
            .then(response => {
                console.log("✅ 로그인 유지됨. 사용자:", response.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                console.log("❌ 로그인 세션 없음");
                setIsAuthenticated(false);
                navigate("/"); // 미로그인 시 로그인 페이지로 이동
            });
    }, [setIsAuthenticated, navigate]);

    /** ✅ Task 목록 불러오기 */
    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/task/${projectId}`);
            console.log("API 응답 데이터:", response.data);
            setTasks(response.data);
        } catch (error) {
            console.error("Task 데이터를 불러오는 중 오류 발생:", error);
        }
    };

    /** ✅ Task 추가 */
    const addTask = async () => {
        if (!newTask.trim()) return;

        try {
            const requestBody = {
                taskName: newTask,
                checking: false,
                projectId: projectId
            };

            console.log("🔵 추가 요청 데이터:", requestBody);
            await axios.post(`/task/create`, requestBody);

            console.log("🟢 Task 추가 성공!");
            setNewTask("");
            fetchTasks(); // ✅ 추가 후 목록 새로고침
        } catch (error) {
            console.error("🛑 Task 추가 중 오류 발생:", error);
        }
    };

    /** ✅ Task 삭제 */
    const deleteTask = async (taskId: number) => {
        try {
            console.log(`🗑️ 삭제 요청: Task ID ${taskId}`);

            await axios.delete(`/task/delete/${taskId}`);

            console.log(`✅ 삭제 완료: Task ID ${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
        } catch (error) {
            console.error(`🛑 삭제 실패: Task ID ${taskId}`, error);
        }
    };

    /** ✅ Task 상태 변경 (체크박스) */
    const toggleTask = async (taskId: number) => {
        try {
            console.log(`🔄 체크 상태 변경 요청: Task ID ${taskId}`);

            await axios.put(`/task/toggle/${taskId}`);

            console.log(`✅ 체크 상태 변경 완료: Task ID ${taskId}`);
            fetchTasks(); // ✅ 목록 새로고침
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
                {tasks.map(task => (
                    <li key={task.taskId} className={task.checking ? "completed" : ""}>
                        <input type="checkbox" checked={task.checking} onChange={() => toggleTask(task.taskId)} />
                        <span>{task.taskName}</span>
                        <button onClick={() => deleteTask(task.taskId)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskComponent;
