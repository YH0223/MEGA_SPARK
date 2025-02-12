package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.InvitationDTO;
import com.jyh000223.mega_project.DTO.ProjectDTO;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Entities.Invitation;
import com.jyh000223.mega_project.Entities.InvitationStatus;
import com.jyh000223.mega_project.Repository.*;
import com.jyh000223.mega_project.Repository.InvitationRepository;
import com.jyh000223.mega_project.Service.ProjectService;
import com.jyh000223.mega_project.Service.TaskService;
import com.jyh000223.mega_project.Service.TeammateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.jyh000223.mega_project.Entities.Teammate;
import java.time.LocalDate;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private TeammateService teammateService;
    @Autowired
    private TeammateRepository teammateRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TaskListRepository taskListRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private NoticeRepository noticeRepository;
    @Autowired
    private InvitationRepository invitationRepository;




    @PostMapping("/createproject")
    public ResponseEntity<String> createProject(@RequestBody ProjectDTO projectdto, HttpServletRequest request) {
        // 유효성 검사: 세션에서 사용자 정보 가져오기
        HttpSession httpSession = request.getSession();
        String projectManager = (String) httpSession.getAttribute("user_id");
        if (projectManager == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유저 정보가 없습니다.");
        }

        // 유효성 검사: 프로젝트 이름 확인
        String projectName = projectdto.getProjectName();
        if (projectName == null || projectName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("프로젝트 이름이 유효하지 않습니다.");
        }

        // 유효성 검사: 날짜 확인
        LocalDate startDate = projectdto.getStartdate();
        LocalDate deadline = projectdto.getDeadline();
        if (startDate.isAfter(deadline)) {
            return ResponseEntity.badRequest().body("시작 날짜는 마감 날짜보다 이전이어야 합니다.");
        }

        // 프로젝트 이름 중복 확인
        if (!isProjectNameAvailable(projectName)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("프로젝트 이름이 중복됩니다.");
        }

        // 프로젝트 생성 및 저장
        Project project = new Project();
        project.setProjectName(projectName);
        project.setProjectManager(projectManager);
        project.setStartdate(startDate);
        project.setDeadline(deadline);
        projectRepository.save(project);


        String result = teammateService.addTeammate(projectManager, project.getProjectId());
        if (!"200".equals(result)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로젝트 생성 성공, 그러나 팀원 등록 실패");
        }
        return ResponseEntity.ok("프로젝트 생성 성공");
    }

    private boolean isProjectNameAvailable(String projectName) {
        return projectRepository.findByProjectName(projectName).isEmpty(); // Optional<Project>가 비어있으면 사용 가능
    }


    @PostMapping("/deleteproject")
    public ResponseEntity<String> deleteProject(HttpServletRequest request, @RequestBody ProjectDTO projectdto) {
        String projectName = projectdto.getProjectName();

        // 세션에서 project_manager 가져오기
        HttpSession session = request.getSession();
        String sessionManager = (String) session.getAttribute("user_id");

        if (sessionManager == null) {
            return ResponseEntity.status(403).body("Unauthorized: No session manager found.");
        }

        // 데이터베이스에서 프로젝트 조회
        Project project = projectRepository.findByProjectName(projectName)
                .orElse(null);

        if (project == null) {
            return ResponseEntity.status(404).body("Project not found.");
        }

        // DB의 project_manager와 세션의 project_manager 비교
        String dbManager = project.getProjectManager();

        if (!sessionManager.equals(dbManager)) {
            return ResponseEntity.status(403).body("Unauthorized: You are not allowed to delete this project.");
        }

        // ✅ 삭제할 프로젝트 ID 가져오기
        int projectId = project.getProjectId();

        try {
            // ✅ 1. teammate 테이블에서 해당 프로젝트의 모든 데이터 삭제
            teammateRepository.deleteByProjectId(projectId);

            // ✅ 2. task 테이블에서 해당 프로젝트의 모든 데이터 삭제
            taskRepository.deleteByProjectId(projectId);
            // 3. tasklist 삭제
            taskListRepository.deleteByProjectId(projectId);

            // ✅ 4. notice 테이블에서 해당 프로젝트의 모든 데이터 삭제
            noticeRepository.deleteByProjectId(projectId);

            // ✅ 5. 프로젝트 자체 삭제
            projectRepository.delete(project);

            return ResponseEntity.ok("200");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting project: " + e.getMessage());
        }
    }

    @PutMapping("/updateproject/{projectId}")
    public ResponseEntity<String> updateProject(HttpServletRequest request,
                                                @PathVariable int projectId,
                                                @RequestBody ProjectDTO projectdto) {
        LocalDate startDate = projectdto.getStartdate();
        LocalDate deadline = projectdto.getDeadline();

        // ✅ 세션에서 user_id 가져오기
        HttpSession session = request.getSession();
        String sessionManager = (String) session.getAttribute("user_id");

        if (sessionManager == null) {
            return ResponseEntity.status(403).body("Unauthorized: No session manager found.");
        }

        // ✅ 프로젝트 조회 (projectId 기준)
        Optional<Project> optionalProject = projectRepository.findById(projectId);
        if (optionalProject.isEmpty()) {
            return ResponseEntity.status(404).body("Project not found.");
        }

        Project project = optionalProject.get();

        // ✅ 현재 세션 유저가 프로젝트 매니저인지 확인
        if (!sessionManager.equals(project.getProjectManager())) {
            return ResponseEntity.status(403).body("Unauthorized: You are not allowed to update this project.");
        }

        // ✅ 시작 날짜가 종료 날짜보다 이후이면 오류 반환
        if (startDate.isAfter(deadline)) {
            return ResponseEntity.status(400).body("Invalid date: Start date must be before the deadline.");
        }

        // ✅ 프로젝트 정보 업데이트
        project.setProjectName(projectdto.getProjectName());
        project.setStartdate(startDate);
        project.setDeadline(deadline);
        projectRepository.save(project);

        return ResponseEntity.ok("✅ 프로젝트가 업데이트되었습니다.");
    }


    /**
     * ✅ 로그인된 사용자의 프로젝트 목록 가져오기
     */
    @GetMapping("/user")
    public ResponseEntity<?> getUserProjects(HttpServletRequest request) {
        System.out.println("📌 /api/user API 요청 받음!");

        // 세션 확인
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            System.out.println("❌ 세션 없음! 401 반환");
            return ResponseEntity.status(401).body("세션이 만료되었습니다. 다시 로그인하세요.");
        }

        String userId = (String) session.getAttribute("user_id");
        System.out.println("✅ API 요청한 user_id: " + userId);

        // user_id 기반으로 User 객체 조회
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            System.out.println("❌ 사용자 없음! 404 반환");
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }

        User user = userOpt.get();

        // 사용자가 속한 프로젝트 ID 목록 가져오기
        List<Integer> projectIds = teammateRepository.findAllByUserId(userId)
                .stream()
                .map(Teammate::getProjectId)
                .distinct()
                .collect(Collectors.toList());

        System.out.println("✅ 사용자가 속한 프로젝트 개수: " + projectIds.size());

        if (projectIds.isEmpty()) {
            System.out.println("⚠️ 사용자가 참여 중인 프로젝트 없음.");
            return ResponseEntity.ok(List.of());
        }

        // 해당 프로젝트 ID로 프로젝트 목록 조회
        List<Project> projects = projectRepository.findAllByProjectIdIn(projectIds);
        System.out.println("✅ 조회된 프로젝트 개수: " + projects.size());

        // 프로젝트 정보를 DTO로 변환하여 반환
        return ResponseEntity.ok(projects.stream().map(project -> new ProjectDTO(
                project.getProjectId(),
                project.getProjectName(),
                project.getProjectManager(),
                project.getStartdate(),
                project.getDeadline()
        )).toList());
    }

    @GetMapping("project/{projectId}")
    public ResponseEntity<Object> getProjectById(@PathVariable int projectId) {
        Optional<Project> project = projectRepository.findById(projectId);

        return project.<ResponseEntity<Object>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).body("해당 프로젝트를 찾을 수 없습니다."));

    }
    @GetMapping("/projects/status")
    public ResponseEntity<Map<String, Integer>> getProjectStatus(HttpSession session) {
        System.out.println("📌 /api/projects/status API 요청 받음!");

        // 현재 로그인된 사용자 확인
        String userId = (String) session.getAttribute("user_id");
        if (userId == null) {
            System.out.println("❌ 세션 없음! 401 반환");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println("✅ API 요청한 user_id: " + userId);

        // 사용자가 속한 프로젝트 ID 가져오기
        List<Integer> projectIds = teammateRepository.findAllByUserId(userId)
                .stream()
                .map(Teammate::getProjectId)
                .distinct()
                .collect(Collectors.toList());

        System.out.println("✅ 사용자가 속한 프로젝트 개수: " + projectIds.size());

        if (projectIds.isEmpty()) {
            System.out.println("⚠️ 프로젝트가 없음. 빈 데이터 반환");
            return ResponseEntity.ok(Map.of("totalProjects", 0, "completedProjects", 0, "inProgressProjects", 0));
        }

        // 사용자가 속한 프로젝트 목록 가져오기
        List<Project> projects = projectRepository.findAllByProjectIdIn(projectIds);
        System.out.println("✅ 조회된 프로젝트 개수: " + projects.size());

        // 프로젝트 상태 계산
        int totalProjects = projects.size();
        int completedProjects = 0;

        for (Project project : projects) {
            List<Task> tasks = taskRepository.findByProject_ProjectId(project.getProjectId());
            if (!tasks.isEmpty() && tasks.stream().allMatch(Task::isChecking)) {
                completedProjects++;
            }
        }

        int inProgressProjects = totalProjects - completedProjects;

        // 결과 반환
        Map<String, Integer> result = new HashMap<>();
        result.put("totalProjects", totalProjects);
        result.put("completedProjects", completedProjects);
        result.put("inProgressProjects", inProgressProjects);

        System.out.println("📌 최종 반환 데이터: " + result);
        return ResponseEntity.ok(result);
    }




    @PostMapping("/invite")
    public ResponseEntity<String> sendInvitation(HttpServletRequest request, @RequestBody InvitationDTO invitationDTO) {
        String inviterId = (String) request.getSession().getAttribute("user_id");
        if (inviterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용하세요.");
        }

        Invitation invitation = new Invitation();
        invitation.setInviterId(inviterId);
        invitation.setInviteeId(invitationDTO.getInviteeId());
        invitation.setProjectId(invitationDTO.getProjectId());
        invitationRepository.save(invitation);

        return ResponseEntity.ok("초대가 전송되었습니다.");
    }



    @PutMapping("/invite/{invitationId}/accept")
    public ResponseEntity<String> acceptInvitation(@PathVariable int invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId).orElse(null);
        if (invitation == null || invitation.getStatus() != InvitationStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("초대를 찾을 수 없습니다.");
        }

        invitation.setStatus(InvitationStatus.ACCEPTED);
        teammateService.addTeammate(invitation.getInviteeId(), invitation.getProjectId());
        invitationRepository.delete(invitation);

        return ResponseEntity.ok("초대를 수락했습니다.");
    }


    @GetMapping("/invitations")
    public ResponseEntity<List<InvitationDTO>> getPendingInvitations(HttpServletRequest request) {
        String inviteeId = (String) request.getSession().getAttribute("user_id");

        if (inviteeId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Invitation> invitations = invitationRepository.findByInviteeIdAndStatus(inviteeId, InvitationStatus.PENDING);

        List<InvitationDTO> invitationDTOs = invitations.stream().map(invitation -> new InvitationDTO(
                invitation.getInvitationId(),
                invitation.getProjectId(),
                invitation.getInviterId(),
                invitation.getInviteeId(),
                invitation.getStatus().toString()
        )).toList();

        return ResponseEntity.ok(invitationDTOs);
    }

    @PutMapping("/invite/{invitationId}/decline")
    public ResponseEntity<String> declineInvitation(@PathVariable int invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId).orElse(null);

        if (invitation == null || invitation.getStatus() != InvitationStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("초대를 찾을 수 없습니다.");
        }

        invitation.setStatus(InvitationStatus.DECLINED);  // 상태를 DECLINED로 변경
        invitationRepository.delete(invitation);

        return ResponseEntity.ok("초대를 거절했습니다.");
    }








}