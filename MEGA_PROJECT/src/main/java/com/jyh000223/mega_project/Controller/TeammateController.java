package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.TeammateDTO;
import com.jyh000223.mega_project.Entities.Teammate;
import com.jyh000223.mega_project.Service.TeammateService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TeammateController {

    private final TeammateService teammateService;

    public TeammateController(TeammateService teammateService) {
        this.teammateService = teammateService;
    }

    /** ✅ 프로젝트 ID 기준으로 팀원 목록 검색 */
    /** ✅ 특정 프로젝트의 팀원 목록 (userId + userName 포함) */
    @GetMapping("/team/{projectId}")
    public ResponseEntity<List<TeammateDTO>> getTeammates(@PathVariable int projectId) {
        List<TeammateDTO> teammates = teammateService.getTeammatesByProject(projectId);
        return ResponseEntity.ok(teammates);
    }

    /** ✅ 팀원 추가 */
    @PostMapping("/addteammate")
    public ResponseEntity<String> addTeammate(@RequestBody TeammateDTO teammateDTO, HttpSession session) {
        String currentUser = (String) session.getAttribute("user_id");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유저 정보가 없습니다.");
        }

        // ✅ 유저 ID 존재 여부 확인
        boolean userExists = teammateService.isUserExists(teammateDTO.getUserId());
        if (!userExists) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 유저입니다.");
        }

        // ✅ 이미 추가된 팀원인지 확인
        boolean alreadyExists = teammateService.isTeammateExists(teammateDTO.getUserId(), teammateDTO.getProjectId());
        if (alreadyExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 추가된 팀원입니다.");
        }

        String result = teammateService.addTeammate(teammateDTO.getUserId(), teammateDTO.getProjectId());
        if ("200".equals(result)) {
            return ResponseEntity.ok("팀원 추가 성공");
        } else if ("404".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("프로젝트가 존재하지 않습니다.");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팀원 추가 중 오류 발생");
    }

    /** ✅ 팀원 삭제 */
    @DeleteMapping("/deleteteammate")
    public ResponseEntity<String> deleteTeammate(@RequestParam String userId, @RequestParam int projectId, HttpSession session) {
        String currentUser = (String) session.getAttribute("user_id");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유저 정보가 없습니다.");
        }

        String result = teammateService.deleteTeammate(userId, projectId, currentUser);
        if ("200".equals(result)) {
            return ResponseEntity.ok("팀원 삭제 성공");
        } else if ("404".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("팀원 또는 프로젝트가 존재하지 않습니다.");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팀원 삭제 중 오류 발생");
    }
}
