package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.NoticeDTO;
import com.jyh000223.mega_project.Entities.Notice;
import com.jyh000223.mega_project.Service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
@CrossOrigin(origins = "http://localhost:3000")
public class NoticeController {
    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }



    @GetMapping("/{projectId}")
    public ResponseEntity<List<Notice>> getNoticesByProject(@PathVariable int projectId) {
        return ResponseEntity.ok(noticeService.getNoticesByProjectId(projectId));
    }


    @PostMapping("/create")
    public ResponseEntity<Notice> createNotice(@RequestBody NoticeDTO noticeDTO) {
        return ResponseEntity.ok(noticeService.createNotice(noticeDTO));
    }

    @GetMapping("/detail/{noticeId}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable int noticeId) {
        try {
            Notice notice = noticeService.getNoticeById(noticeId);
            return ResponseEntity.ok(notice);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/delete/{noticeId}")
    public ResponseEntity<Void> deleteNotice(@PathVariable int noticeId) {
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{noticeId}")
    public ResponseEntity<Notice> updateNotice(@PathVariable int noticeId, @RequestBody NoticeDTO noticeDTO) {
        return ResponseEntity.ok(noticeService.updateNotice(noticeId, noticeDTO));
    }
}
