package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.TaskDTO;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Repository.TaskRepository;
import com.jyh000223.mega_project.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    @Autowired
    private TaskService taskService;
    @Autowired
    private TaskRepository taskRepository;
    @GetMapping("/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable int projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }
    /**
     * ✅ 프로젝트 ID와 TaskList ID로 Task 조회
     */
    @GetMapping("/{projectId}/{tasklistId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectAndTasklist(
            @PathVariable int projectId,
            @PathVariable int tasklistId) {
        return ResponseEntity.ok(taskService.getTasksByProjectAndTasklist(projectId, tasklistId));
    }



    @PostMapping("/create")
    public ResponseEntity<Task> createTask(@RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.createTask(taskDTO));
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable int taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/toggle/{taskId}")
    public ResponseEntity<Void> toggleTask(@PathVariable int taskId) {
        taskService.toggleTaskChecking(taskId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/progress/{projectId}")
    public ResponseEntity<Map<String, Object>> getTaskProgress(@PathVariable int projectId) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream().filter(Task::isChecking).count();

        double completionPercentage = totalTasks == 0 ? 0 : ((double) completedTasks / totalTasks) * 100;

        Map<String, Object> response = new HashMap<>();
        response.put("percentage", completionPercentage);

        return ResponseEntity.ok(response);
    }
    /** ✅ 프로젝트별 Task 개수 조회 */
    @GetMapping("/count/{projectId}")
    public ResponseEntity<Map<String, Integer>> getTaskCount(@PathVariable int projectId) {
        int taskCount = taskService.countTasksByProjectId(projectId);
        Map<String, Integer> response = new HashMap<>();
        response.put("taskCount", taskCount);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/task-stats/{projectId}")
    public ResponseEntity<Map<String, Integer>> getTaskStats(@PathVariable int projectId) {
        Map<String, Integer> taskStats = taskService.getTaskStatistics(projectId);
        return ResponseEntity.ok(taskStats);
    }
    @PutMapping("/update/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable int taskId, @RequestBody TaskDTO taskDTO) {
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
            Task updatedTask = taskRepository.save(task);

            // ✅ TaskDTO 변환하여 taskId 포함해서 반환
            TaskDTO updatedDTO = TaskDTO.builder()
                    .taskId(updatedTask.getTaskId()) // ✅ taskId 포함!
                    .taskName(updatedTask.getTaskName())
                    .checking(updatedTask.isChecking())
                    .projectId(updatedTask.getProject().getProjectId())
                    .userId(updatedTask.getUserId())
                    .startDate(updatedTask.getStartDate())
                    .deadline(updatedTask.getDeadline())
                    .priority(updatedTask.getPriority())
                    .tasklistName(updatedTask.getTaskList().getTasklistName())
                    .build();

            return ResponseEntity.ok(updatedDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
