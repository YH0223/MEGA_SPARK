package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.TaskCalendarDTO;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController  // ✅ @Controller → @RestController 변경
@RequestMapping("/task") // ✅ 올바른 API 경로 설정
public class TaskCalendarController {

    @Autowired
    private TaskService taskService;

    /** ✅ 프로젝트 ID로 특정 월의 Task 조회 */
    @GetMapping("/taskcalendar/{projectId}")
    public ResponseEntity<List<TaskCalendarDTO>> getTasksForCalendar(
            @PathVariable int projectId,
            @RequestParam(value = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start, // ✅ LocalDate 변환 가능하도록 설정
            @RequestParam(value = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        // ✅ start와 end가 없으면 현재 월의 1일부터 마지막일까지 자동 설정
        if (start == null || end == null) {
            LocalDate today = LocalDate.now();
            start = today.withDayOfMonth(1);
            end = today.withDayOfMonth(today.lengthOfMonth());
        }

        List<Task> tasks = taskService.getTasksForCalendar(projectId, start, end);

        // ✅ Task -> TaskCalendarDTO 변환 (`taskId` 추가됨!)
        List<TaskCalendarDTO> taskDTOs = tasks.stream()
                .map(task -> new TaskCalendarDTO(
                        task.getTaskId(),  // ✅ taskId 추가
                        task.getTaskName(),
                        task.getStartDate(),
                        task.getDeadline(),
                        task.isChecking()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(taskDTOs);
    }
}
