package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.TasklistDTO;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.TaskList;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Service.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasklist")
public class TaskListController {
    private final TaskListService taskListService;
    @Autowired
    private ProjectRepository projectRepository;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    /** ✅ 프로젝트별 TaskList 조회 */
    @GetMapping("/{projectId}")
    public ResponseEntity<List<TaskList>> getTaskListsByProject(@PathVariable int projectId) {
        List<TaskList> taskLists = taskListService.getTaskListsByProjectId(projectId);
        return ResponseEntity.ok(taskLists);
    }


    @PostMapping("/create")
    public ResponseEntity<?> createTaskList(@RequestBody TasklistDTO tasklistDTO) {
        // 🔴 유효성 검사 추가 (tasklistName이 null이면 안됨)
        if (tasklistDTO.getTasklistName() == null || tasklistDTO.getTasklistName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("❌ TaskList 이름이 비어 있습니다.");
        }

        // 🔴 프로젝트 존재 여부 확인
        Optional<Project> project = projectRepository.findById(tasklistDTO.getProjectId());
        if (project.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ 프로젝트가 존재하지 않습니다.");
        }

        // ✅ TaskList 생성 및 저장
        TaskList taskList = new TaskList();
        taskList.setTasklistName(tasklistDTO.getTasklistName()); // 🔴 필드 이름 일치
        taskList.setProject(project.get());

        TaskList savedTaskList = taskListService.createTaskList(taskList);

        // ✅ 저장된 TaskList 반환
        return ResponseEntity.ok(new TasklistDTO(
                savedTaskList.getTasklistId(),
                savedTaskList.getTasklistName(),
                savedTaskList.getProject().getProjectId()
        ));
    }
}
