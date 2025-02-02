package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.TeammateDTO;
import com.jyh000223.mega_project.Service.TeammateService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TeammateController {

    private final TeammateService teammateService;

    public TeammateController(TeammateService teammateService) {
        this.teammateService = teammateService;
    }

    @PostMapping("/addteammate")
    public ResponseEntity<String> addTeammate(@RequestBody TeammateDTO teammateDTO, HttpSession httpSession) {
        // 세션에서 사용자 정보 가져오기
        String currentUser = (String) httpSession.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유저 정보가 없습니다.");
        }

        // 요청 데이터 검증
        if (teammateDTO.getUserId() == null || teammateDTO.getProjectId() == 0) {
            return ResponseEntity.badRequest().body("잘못된 요청 데이터입니다.");
        }

        // 서비스 호출하여 팀원 추가 처리
        String result = teammateService.addTeammate(teammateDTO.getUserId(), teammateDTO.getProjectId());
        if ("200".equals(result)) {
            return ResponseEntity.ok("팀원 추가 성공");
        } else if ("403".equals(result)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
        } else if ("404".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("프로젝트가 존재하지 않습니다.");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팀원 추가 중 오류 발생");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTeammate(@RequestBody TeammateDTO teammateDTO, HttpSession httpSession) {
        // 세션에서 사용자 정보 가져오기
        String currentUser = (String) httpSession.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유저 정보가 없습니다.");
        }

        // 요청 데이터 검증
        if (teammateDTO.getUserId() == null || teammateDTO.getProjectId() == 0) {
            return ResponseEntity.badRequest().body("잘못된 요청 데이터입니다.");
        }

        // 서비스 호출하여 팀원 삭제 처리
        String result = teammateService.deleteTeammate(teammateDTO.getUserId(), teammateDTO.getProjectId(), currentUser);
        if ("200".equals(result)) {
            return ResponseEntity.ok("팀원 삭제 성공");
        } else if ("403".equals(result)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
        } else if ("404".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("팀원 또는 프로젝트가 존재하지 않습니다.");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팀원 삭제 중 오류 발생");
    }
}

