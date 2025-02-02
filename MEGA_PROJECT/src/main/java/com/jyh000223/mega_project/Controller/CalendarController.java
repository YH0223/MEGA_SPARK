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
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("user_id");  // 세션에서 user_id 가져오기

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing in session.");
        }

        // 1️⃣ userId 기준으로 Teammate 리스트 조회
        List<Teammate> teammates = teammateRepository.findAllByUserId(userId);

        // 2️⃣ Teammate 리스트에서 Project ID 목록 추출
        List<Integer> projectIds = teammates.stream()
                .map(Teammate::getProjectId)
                .distinct()  // 중복 제거
                .toList();

        if (projectIds.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // 3️⃣ Project 테이블에서 projectId 목록으로 프로젝트 조회
        List<Project> projects = projectRepository.findAllByProjectIdIn(projectIds);

        // 4️⃣ 조회된 프로젝트 리스트를 DTO로 변환
        List<ProjectCalendarDTO> calendarData = projects.stream()
                .map(project -> new ProjectCalendarDTO(
                        project.getProjectId(),
                        project.getProjectName(),
                        project.getStartdate(),
                        project.getDeadline()
                ))
                .toList();

        // 5️⃣ 변환된 DTO 리스트를 반환
        return ResponseEntity.ok(calendarData);
    }


}
