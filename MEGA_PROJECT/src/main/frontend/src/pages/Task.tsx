import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import "./Task.css";

axios.defaults.withCredentials = true;

interface Task {
    taskId: number;
    taskName: string;
    checking: boolean;
    priority: number;
    startDate: string;
    deadline: string;
    userId: string;
    tasklistId: number;
    tasklistName?: string;
}

interface TaskList {
    tasklistId: number;
    tasklistName: string;
}

const TaskComponent = ({ projectId }: { projectId: number }) => {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [tasks, setTasks] = useState<Record<number, Task[]>>({});
    const [newTaskListName, setNewTaskListName] = useState("");
    const [isTaskListModalOpen, setTaskListModalOpen] = useState(false);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [selectedTaskList, setSelectedTaskList] = useState<number | null>(null);
    const [newTask, setNewTask] = useState({ taskName: "", userId: "", priority: 0, startDate: "", deadline: "" });
    const [users, setUsers] = useState<string[]>([]);

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskProgress, setTaskProgress] = useState<number>(0);
    const [taskCount, setTaskCount] = useState<number>(0);
    useEffect(() => {
        axios.get("http://localhost:8080/api/session")
            .then(() => setIsAuthenticated(true))
            .catch(() => {
                setIsAuthenticated(false);
                navigate("/");
            });
    }, [setIsAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTaskLists();
            fetchUsers();
        }
    }, [isAuthenticated]);
    useEffect(() => {
        console.log("📌 [현재 Task 상태]:", tasks);
    }, [tasks]);
    /** ✅ TaskList 불러오기 (각 Task도 함께 가져오기) */
    const fetchTaskLists = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/tasklist/${projectId}`);
            setTaskLists(response.data);

            const taskData: Record<number, Task[]> = {};
            await Promise.all(
                response.data.map(async (taskList: TaskList) => {
                    const taskResponse = await axios.get(`http://localhost:8080/task/${projectId}/${taskList.tasklistId}`);
                    taskData[taskList.tasklistId] = taskResponse.data.map((taskList: TaskList) => ({
                        ...taskList,
                        tasklistName: taskList.tasklistName, // ✅ tasklistName을 Task에 추가
                    }));
                })
            );

            setTasks(taskData);
        } catch (error) {
            console.error("🛑 Task List 불러오기 실패:", error);
        }
    };






    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/team/${projectId}`);  // ✅ 팀원 목록 가져오기
            console.log("✅ [팀원 목록] 응답 데이터:", response.data);

            // userId가 있고, userName 대신 projectManager를 사용하여 변환
            const formattedUsers = response.data.map((user: any) => ({
                userId: user.userId,
                userName: user.userName // ✅ 이름 필드가 없으므로 projectManager 사용
            }));

            setUsers(formattedUsers);
        } catch (error) {
            console.error("🛑 팀원 목록 불러오기 실패:", error);
        }
    };
    /** ✅ 특정 TaskList의 Task 불러오기 */
    const fetchTasks = async (tasklistId: number) => {
        try {
            console.log(`🟠 [fetchTasks 실행 - taskListId: ${tasklistId}]`);
            const response = await axios.get(`http://localhost:8080/task/${projectId}/${tasklistId}`);
            console.log(`🔍 [taskListId ${tasklistId}의 Task 데이터]:`, response.data);

            // ✅ taskLists에서 해당 tasklistId의 tasklistName을 찾기
            const tasklist = taskLists.find(t => t.tasklistId === tasklistId);
            const tasklistName = tasklist ? tasklist.tasklistName : "알 수 없음";
            console.log(`📌 [taskListId ${tasklistId}의 TaskList Name]: ${tasklistName}`);

            const updatedTasks = response.data.map((task: Task) => ({
                ...task,
                tasklistId,
                tasklistName, // ✅ tasklistName 추가
            }));

            setTasks(prevTasks => {
                const newTasks = { ...prevTasks };
                newTasks[tasklistId] = updatedTasks; // ✅ 특정 tasklistId에 대한 데이터만 업데이트
                console.log(`🟢 [Task 상태 업데이트 - tasklistId ${tasklistId}]:`, newTasks);
                return newTasks;
            });

        } catch (error) {
            console.error(`🛑 Task 불러오기 실패 (taskListId: ${tasklistId})`, error);
        }
    };


    /** ✅ TaskList 추가 */
    const addTaskList = async () => {
        if (!newTaskListName.trim()) {
            alert("❌ TaskList 이름을 입력하세요.");
            return;
        }

        console.log("🔵 [프론트엔드] 전송할 데이터:", {
            tasklistName: newTaskListName,
            projectId: projectId
        });

        try {
            const requestBody = {
                tasklistName: newTaskListName, // ✅ 올바르게 값을 포함
                projectId: projectId  // ✅ 올바르게 projectId를 포함
            };

            const response = await axios.post(`http://localhost:8080/tasklist/create`, requestBody);
            console.log("🟢 [서버 응답] TaskList 추가 성공:", response.data);

            alert("✅ TaskList 추가 성공!");
            fetchTaskLists();
            setNewTaskListName(""); // ✅ 입력 초기화
            setTaskListModalOpen(false); // ✅ 모달 닫기
        } catch (error: any) {
            console.error("🛑 TaskList 추가 중 오류 발생:", error);
            alert(`❌ 오류 발생: ${error.response?.data || "알 수 없는 오류"}`);
        }
    };


    /** ✅ TaskList 삭제 */
    const deleteTaskList = async (tasklistId: number) => {
        if (!window.confirm("⚠️ 해당 TaskList와 모든 Task가 삭제됩니다. 진행하시겠습니까?")) return;

        try {
            await axios.delete(`http://localhost:8080/tasklist/delete/${tasklistId}`);
            alert("✅ TaskList가 삭제되었습니다.");
            fetchTaskLists(); // ✅ 삭제 후 목록 새로고침
        } catch (error) {
            console.error("🛑 TaskList 삭제 실패:", error);
            alert("❌ TaskList 삭제 중 오류가 발생했습니다.");
        }
    };


    /** ✅ Task 추가 */
    const addTask = async () => {
        if (!newTask.taskName.trim() || !selectedTaskList) return;
        try {
            await axios.post(`http://localhost:8080/task/create`, {
                taskName: newTask.taskName,
                checking: false,
                priority: newTask.priority,
                startDate: newTask.startDate,
                deadline: newTask.deadline,
                userId: newTask.userId,
                tasklistId: selectedTaskList,
                projectId
            });

            setNewTask({ taskName: "", userId: "", priority: 0, startDate: "", deadline: "" });
            setTaskModalOpen(false);

            console.log("🟢 Task 추가 성공!");
            fetchTasks(selectedTaskList); // ✅ 해당 TaskList의 Task 즉시 불러오기
        } catch (error) {
            console.error("🛑 Task 추가 실패:", error);
        }
    };
    /** ✅ Task 진행률 불러오기 */
    const fetchTaskProgress = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/task/progress/${projectId}`);
            setTaskProgress(response.data.percentage);
        } catch (error) {
            console.error("🛑 Task 진행률 불러오기 실패:", error);
        }
    };

    /** ✅ Task 개수 불러오기 */
    const fetchTaskCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/task/count/${projectId}`);
            setTaskCount(response.data.taskCount);
        } catch (error) {
            console.error("🛑 Task 개수 불러오기 실패:", error);
        }
    };

    const openEditModal = (task: Task) => {
        console.log("🔍 [클릭한 Task]:", task); // ✅ Task가 잘 넘어오는지 확인
        setSelectedTask(task);
        setEditModalOpen(true);
    };

    useEffect(() => {
        console.log("📌 [선택된 Task]:", selectedTask); // ✅ 선택된 Task 변경 감지
    }, [selectedTask]);

    const updateTask = async () => {
        if (!selectedTask) return;

        console.log("🟢 [Task 업데이트 요청]:", selectedTask);

        try {
            await axios.put(`http://localhost:8080/task/update/${selectedTask.taskId}`, {
                ...selectedTask,
                priority: selectedTask.priority ?? 0,  // ✅ priority가 undefined일 경우 기본값 0 설정
            });

            fetchTaskLists();
            setEditModalOpen(false);
        } catch (error) {
            console.error("🛑 Task 수정 실패:", error);
        }
    };


    /** ✅ Task 삭제 API 호출 */
    const deleteTask = async () => {
        if (!selectedTask) return;

        try {
            await axios.delete(`http://localhost:8080/task/delete/${selectedTask.taskId}`);
            fetchTaskLists();
            setEditModalOpen(false);
        } catch (error) {
            console.error("🛑 Task 삭제 실패:", error);
        }
    };
    /** ✅ Task 체크 상태 토글 API 호출 */
    const toggleTaskChecking = async () => {
        if (!selectedTask) return;

        try {
            await axios.put(`http://localhost:8080/task/toggle/${selectedTask.taskId}`);
            fetchTaskLists();
            setEditModalOpen(false);
        } catch (error) {
            console.error("🛑 Task 체크 상태 변경 실패:", error);
        }
    };

    return (
        <div className="task-container">
            <h2>체크리스트 목록</h2>
            <button onClick={() => setTaskListModalOpen(true)}>+ TaskList 추가</button>

            {taskLists?.map((taskList) => (
                <div key={taskList.tasklistId} className="task-group">
                    <h3>TaskList : {taskList.tasklistName}</h3>
                    <button onClick={() => deleteTaskList(taskList.tasklistId)} className="delete-tasklist-button">
                        🗑️ TaskList 삭제 -
                    </button>
                    <button onClick={() => {
                        setSelectedTaskList(taskList.tasklistId);
                        setTaskModalOpen(true);
                    }}>
                        Task 추가 +
                    </button>
                    <ul className="task-list">
                        {tasks[taskList.tasklistId] && tasks[taskList.tasklistId].length > 0 ? (
                            tasks[taskList.tasklistId].map((task) => {
                                const priorityColors = ["gray", "yellow", "red"];
                                const priorityLabels = ["ToDo", "Issue", "Hazard"];

                                const circleColor = task.checking ? "green" : priorityColors[task.priority];
                                const priorityText = task.checking ? "Solved" : priorityLabels[task.priority];

                                return (
                                    <li key={task.taskId} className="task-item" onClick={() => openEditModal(task)}>
                            <span className="priority-indicator"
                                  style={{backgroundColor: circleColor}}
                                  onClick={(e) => e.stopPropagation()}></span>
                                        <span>{task.taskName}</span>
                                        <span>👤 {task.userId || "담당자 없음"}</span>
                                        <span>📅 {task.startDate || "날짜 없음"} ~ {task.deadline || "날짜 없음"}</span>
                                        <span className="priority-text">{priorityText}</span>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="empty-task">📌 할 일이 없습니다.</li>
                        )}
                    </ul>
                </div>
            ))}

            {/* ✅ Task 수정/삭제 모달 */}
            {isEditModalOpen && selectedTask && (
                <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Task 수정</h2>

                        {/* ✅ Task 이름 수정 */}
                        <label>Task 이름</label>
                        <input
                            type="text"
                            value={selectedTask.taskName}
                            onChange={(e) => setSelectedTask({ ...selectedTask, taskName: e.target.value })}
                        />

                        {/* ✅ 시작 날짜 수정 */}
                        <label>시작 날짜</label>
                        <input
                            type="date"
                            value={selectedTask.startDate}
                            onChange={(e) => setSelectedTask({ ...selectedTask, startDate: e.target.value })}
                        />

                        {/* ✅ 마감 날짜 수정 */}
                        <label>마감 날짜</label>
                        <input
                            type="date"
                            value={selectedTask.deadline}
                            onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
                        />

                        {/* ✅ Task 완료 여부 (체크 상태) */}
                        <label>상태</label>
                        <button
                            onClick={() =>
                                setSelectedTask({ ...selectedTask, checking: !selectedTask.checking })
                            }
                            style={{
                                backgroundColor: selectedTask.checking ? "#4CAF50" : "#FF3D00",
                                color: "white",
                                padding: "8px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            {selectedTask.checking ? "완료됨 (✔)" : "미완료 (❌)"}
                        </button>
                        {/* ✅ 우선순위(priority) 수정 */}
                        <label>우선순위</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="0"
                                    checked={selectedTask.priority === 0}
                                    onChange={() => {
                                        setSelectedTask(prev => {
                                            console.log("✅ 우선순위 변경됨: ToDo (0)");
                                            return {...prev, priority: 0};
                                        });
                                    }}
                                />
                                ⚪ ToDo
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="1"
                                    checked={selectedTask.priority === 1}
                                    onChange={() => {
                                        setSelectedTask(prev => {
                                            console.log("✅ 우선순위 변경됨: Issue (1)");
                                            return {...prev, priority: 1};
                                        });
                                    }}
                                />
                                🟡 Issue
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="2"
                                    checked={selectedTask.priority === 2}
                                    onChange={() => {
                                        setSelectedTask(prev => {
                                            console.log("✅ 우선순위 변경됨: Hazard (2)");
                                            return { ...prev, priority: 2 };
                                        });
                                    }}
                                />
                                🔴 Hazard
                            </label>
                        </div>
                        {/* ✅ 수정/삭제 버튼 */}
                        <button onClick={updateTask}>수정</button>
                        <button onClick={deleteTask} style={{ backgroundColor: "#FF3D00" }}>삭제</button>
                        <button onClick={() => setEditModalOpen(false)}>취소</button>
                    </div>
                </div>
            )}


            {/* TaskList 추가 모달 */}
            {isTaskListModalOpen && (
                <div className="modal-overlay" onClick={() => setTaskListModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>TaskList 추가</h2>
                        <input
                            type="text"
                            value={newTaskListName}
                            onChange={(e) => setNewTaskListName(e.target.value)}
                            placeholder="TaskList 이름"
                        />
                        <button onClick={addTaskList}>추가</button>
                        <button onClick={() => setTaskListModalOpen(false)}>취소</button>
                    </div>
                </div>
            )}

            {/* Task 추가 모달 */}
            {isTaskModalOpen && (
                <div className="modal-overlay" onClick={() => setTaskModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Task 추가</h2>
                        <input
                            type="text"
                            value={newTask.taskName}
                            onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
                            placeholder="Task 이름"
                        />
                        <label>담당자</label>
                        <select value={newTask.userId}
                                onChange={(e) => setNewTask({...newTask, userId: e.target.value})}>
                            <option value="">선택</option>
                            {users.map((user) => (
                                <option key={user.userId} value={user.userId}>
                                {user.userName} {/* ✅ 유저 이름 표시 */}
                                </option>
                            ))}
                        </select>


                        <label>시작 날짜</label>
                        <input type="date" value={newTask.startDate}
                               onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}/>
                        <label>마감 날짜</label>
                        <input type="date" value={newTask.deadline}
                               onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}/>
                        <label>우선순위</label>
                        <div>
                            <label><input type="radio" name="priority" value="0"
                                          onChange={() => setNewTask({...newTask, priority: 0})}/> ToDo</label>
                            <label><input type="radio" name="priority" value="1"
                                          onChange={() => setNewTask({...newTask, priority: 1})}/> Issue</label>
                            <label><input type="radio" name="priority" value="2"
                                          onChange={() => setNewTask({...newTask, priority: 2})}/> Hazard</label>
                        </div>
                        <button onClick={addTask}>추가</button>
                        <button onClick={() => setTaskModalOpen(false)}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskComponent;
