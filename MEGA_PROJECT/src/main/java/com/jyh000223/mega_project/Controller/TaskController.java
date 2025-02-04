package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.TaskDTO;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@CrossOrigin(origins = "http://localhost:3000")
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
}
