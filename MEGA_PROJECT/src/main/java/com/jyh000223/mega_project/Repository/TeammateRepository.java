package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Teammate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TeammateRepository extends JpaRepository<Teammate, Integer> {
    Teammate findByUserId(String userId);

    Teammate findByProjectId(int projectId);

    Teammate findByUserIdAndProjectId(String userId, int projectId);
    List<Teammate> findAllByUserId(String userId);

    List<Teammate> findAllByProjectId(int projectId);

    boolean existsByUserIdAndProjectId(String userId, int projectId);


    // ✅ JPQL을 사용하여 명시적으로 삭제 쿼리 작성
    @Modifying
    @Transactional
    @Query("DELETE FROM Task t WHERE t.project.projectId = :projectId")
    void deleteByProjectId(@Param("projectId") int projectId);
}
