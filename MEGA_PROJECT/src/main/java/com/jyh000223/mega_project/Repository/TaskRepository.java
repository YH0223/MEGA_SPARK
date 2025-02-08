package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByProject_ProjectId(int projectId);

    // ✅ JPQL을 사용하여 명시적으로 삭제 쿼리 작성
    @Modifying
    @Transactional
    @Query("DELETE FROM Task t WHERE t.project.projectId = :projectId")
    void deleteByProjectId(@Param("projectId") int projectId);

    int countByProject_ProjectId(int projectId);
}
