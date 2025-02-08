package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.TaskDTO;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/task")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable int projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
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

}
