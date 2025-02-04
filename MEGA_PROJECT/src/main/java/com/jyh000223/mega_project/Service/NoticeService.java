package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.DTO.NoticeDTO;
import com.jyh000223.mega_project.Entities.Notice;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Repository.NoticeRepository;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;
    private final ProjectRepository projectRepository;

    public NoticeService(NoticeRepository noticeRepository, ProjectRepository projectRepository) {
        this.noticeRepository = noticeRepository;
        this.projectRepository = projectRepository;
    }

    public List<Notice> getNoticesByProjectId(int projectId) {
        return noticeRepository.findByProject_ProjectId(projectId);
    }

    public Notice getNoticeById(int noticeId) {
        return noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 존재하지 않습니다. ID: " + noticeId));
    }


    public Notice createNotice(NoticeDTO noticeDTO) {
        Optional<Project> projectOpt = projectRepository.findById(noticeDTO.getProject_id());

        if (projectOpt.isEmpty()) {
            throw new IllegalArgumentException("Project ID가 유효하지 않습니다.");
        }

        Notice notice = new Notice();
        notice.setNoticeTitle(noticeDTO.getNotice_title());
        notice.setNoticeContext(noticeDTO.getNotice_context());
        notice.setProject(projectOpt.get());

        return noticeRepository.save(notice);
    }

    public void deleteNotice(int noticeId) {
        noticeRepository.deleteById(noticeId);
    }

    public Notice updateNotice(int noticeId, NoticeDTO noticeDTO) {
        Optional<Notice> noticeOpt = noticeRepository.findById(noticeId);

        if (noticeOpt.isPresent()) {
            Notice notice = noticeOpt.get();
            notice.setNoticeTitle(noticeDTO.getNotice_title());
            notice.setNoticeContext(noticeDTO.getNotice_context());
            return noticeRepository.save(notice);
        } else {
            throw new IllegalArgumentException("공지사항이 존재하지 않습니다.");
        }
    }
}
