package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    List<Notice> findByProject_ProjectId(int projectId);
}
