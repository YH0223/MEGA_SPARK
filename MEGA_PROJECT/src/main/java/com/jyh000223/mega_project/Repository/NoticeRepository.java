package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    List<Notice> findByProject_ProjectId(int projectId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notice n WHERE n.project.projectId = :projectId")
    void deleteByProjectId( int projectId);
}
