package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.ProjectCalendarDTO;
import com.jyh000223.mega_project.DTO.ProjectDTO;
import com.jyh000223.mega_project.DTO.TeammateDTO;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Teammate;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TeammateRepository;
import com.jyh000223.mega_project.Service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CalendarController {

    @Autowired
    private TeammateRepository teammateRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/calendar_project")
    public ResponseEntity<List<ProjectCalendarDTO>> getCalendar(HttpServletRequest request) {
        System.out.println("📌 /api/calendar_project API 요청 받음!"); // 콘솔에 로그 추가

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            System.out.println("❌ 세션 없음! 401 반환");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
        }

        String userId = (String) session.getAttribute("user_id");
        System.out.println("✅ API 요청한 user_id: " + userId);

        List<Teammate> teammates = teammateRepository.findAllByUserId(userId);
        System.out.println("✅ 사용자가 속한 팀원 수: " + teammates.size());

        List<Integer> projectIds = teammates.stream()
                .map(Teammate::getProjectId)
                .distinct()
                .toList();
        System.out.println("✅ 사용자가 속한 프로젝트 ID 리스트: " + projectIds);

        if (projectIds.isEmpty()) {
            System.out.println("⚠️ 프로젝트가 없음. 빈 배열 반환");
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Project> projects = projectRepository.findAllByProjectIdIn(projectIds);
        System.out.println("✅ 조회된 프로젝트 개수: " + projects.size());

        List<ProjectCalendarDTO> calendarData = projects.stream()
                .map(project -> new ProjectCalendarDTO(
                        project.getProjectId(),
                        project.getProjectName(),
                        project.getStartdate(),
                        project.getDeadline()
                ))
                .toList();

        System.out.println("📌 최종 반환할 데이터 개수: " + calendarData.size());
        return ResponseEntity.ok().header("Content-Type", "application/json").body(calendarData);
    }




}
