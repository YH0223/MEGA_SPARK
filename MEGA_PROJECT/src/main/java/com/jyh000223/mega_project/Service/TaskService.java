package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.DTO.TaskDTO;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Entities.TaskList;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TaskListRepository;
import com.jyh000223.mega_project.Repository.TaskRepository;
import com.jyh000223.mega_project.Repository.UserRepository;
import org.springframework.stereotype.Service;
import com.jyh000223.mega_project.DTO.TaskDTO;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskListRepository taskListRepository;
    private final UserRepository userRepository;
    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,UserRepository userRepository,TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.taskListRepository = taskListRepository;
        this.userRepository=userRepository;
    }

    public List<Task> getTasksByProjectId(int projectId) {
        return taskRepository.findByProject_ProjectId(projectId);
    }

    public Task createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTaskName(taskDTO.getTaskName());
        task.setChecking(taskDTO.isChecking());
        task.setPriority(taskDTO.getPriority());
        task.setStartDate(taskDTO.getStartDate());
        task.setDeadline(taskDTO.getDeadline());
        task.setUserId(taskDTO.getUserId());

        // ✅ Project 확인
        Project project = projectRepository.findById(taskDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);

        // ✅ TaskList 확인
        TaskList taskList = taskListRepository.findById(taskDTO.getTasklistId())
                .orElseThrow(() -> new RuntimeException("TaskList not found"));

        System.out.println("🔍 찾은 TaskList ID: " + taskList.getTasklistId());  // ✅ 로그 추가
        System.out.println("🔍 찾은 TaskList 이름: " + taskList.getTasklistName());

        task.setTaskList(taskList); // ✅ Task에 할당

        Task savedTask = taskRepository.save(task);
        System.out.println("✅ 저장된 Task ID: " + savedTask.getTaskId());
        System.out.println("✅ 저장된 Task의 TaskList ID: " + savedTask.getTaskList().getTasklistId());

        return savedTask;
    }
    public void deleteTask(int taskId) {
        taskRepository.deleteById(taskId);
    }

    public void toggleTaskChecking(int taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);

        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setChecking(!task.isChecking());
            taskRepository.save(task);
        }
    }
    /** ✅ 프로젝트별 Task 개수 세기 */
    public int countTasksByProjectId(int projectId) {
        return taskRepository.countByProject_ProjectId(projectId);
    }

    public Map<String, Integer> getTaskStatistics(int projectId) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);
        if (optionalProject.isEmpty()) {
            throw new IllegalArgumentException("프로젝트가 존재하지 않습니다.");
        }
        Project project = optionalProject.get();

        int completed = taskRepository.countByProjectAndChecking(project, true);
        int todo = taskRepository.countByProjectAndCheckingAndPriority(project, false, 0);
        int issue = taskRepository.countByProjectAndCheckingAndPriority(project, false, 1);
        int hazard = taskRepository.countByProjectAndCheckingAndPriority(project, false, 2);

        Map<String, Integer> taskStats = new HashMap<>();
        taskStats.put("completed", completed);
        taskStats.put("todo", todo);
        taskStats.put("issue", issue);
        taskStats.put("hazard", hazard);

        return taskStats;
    }

    public List<TaskDTO> getTasksByProjectAndTasklist(int projectId, int tasklistId) {
        List<Task> tasks = taskRepository.findByProject_ProjectIdAndTaskList_TasklistId(projectId, tasklistId); // ✅ tasklistId 필터링 추가

        return tasks.stream().map(task -> {
            String userName = userRepository.findUserNameByUserId(task.getUserId())
                    .orElse("Unknown");


            return TaskDTO.builder()
                    .taskId(task.getTaskId())
                    .taskName(task.getTaskName())
                    .checking(task.isChecking())
                    .priority(task.getPriority())
                    .startDate(task.getStartDate())
                    .deadline(task.getDeadline())
                    .userId(task.getUserId())
                    .userName(userName) // ✅ userName 추가
                    .tasklistName(task.getTaskList().getTasklistName())
                    .tasklistId(task.getTaskList().getTasklistId())
                    .build();
        }).collect(Collectors.toList());
    }
    public List<Task> getTasksForCalendar(int projectId, LocalDate startDate, LocalDate endDate) {
        return taskRepository.findByProject_ProjectIdAndStartDateBetween(projectId, startDate, endDate);
    }

    public TaskDTO updateTask(int taskId, TaskDTO taskDTO) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();

            // ✅ 업데이트할 필드 적용
            task.setTaskName(taskDTO.getTaskName());
            task.setChecking(taskDTO.isChecking());
            task.setStartDate(taskDTO.getStartDate());
            task.setDeadline(taskDTO.getDeadline());
            task.setPriority(taskDTO.getPriority());

            // ✅ Task 저장
            taskRepository.save(task);

            return taskDTO; // 📌 기존: 변경된 Task를 다시 반환함
        } else {
            throw new RuntimeException("Task ID " + taskId + "를 찾을 수 없습니다.");
        }
    }



}
