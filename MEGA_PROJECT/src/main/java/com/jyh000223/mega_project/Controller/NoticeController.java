package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.NoticeDTO;
import com.jyh000223.mega_project.Entities.Notice;
import com.jyh000223.mega_project.Service.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NoticeController {
    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // ✅ 세션 체크 메서드
    private boolean isUserAuthenticated(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null && session.getAttribute("user_id") != null;
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<List<Notice>> getNoticesByProject(@PathVariable int projectId, HttpServletRequest request) {
        if (!isUserAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(noticeService.getNoticesByProjectId(projectId));
    }

    @PostMapping("/create")
    public ResponseEntity<Notice> createNotice(@RequestBody NoticeDTO noticeDTO, HttpServletRequest request) {
        if (!isUserAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(noticeService.createNotice(noticeDTO));
    }


    @GetMapping("/detail/{noticeId}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable int noticeId, HttpServletRequest request) {
        if (!isUserAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // ❌ 인증되지 않은 요청은 차단됨
        }
        try {
            Notice notice = noticeService.getNoticeById(noticeId);
            return ResponseEntity.ok(notice);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/delete/{noticeId}")
    public ResponseEntity<Void> deleteNotice(@PathVariable int noticeId, HttpServletRequest request) {
        if (!isUserAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{noticeId}")
    public ResponseEntity<Notice> updateNotice(@PathVariable int noticeId, @RequestBody NoticeDTO noticeDTO, HttpServletRequest request) {
        if (!isUserAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(noticeService.updateNotice(noticeId, noticeDTO));
    }
}
