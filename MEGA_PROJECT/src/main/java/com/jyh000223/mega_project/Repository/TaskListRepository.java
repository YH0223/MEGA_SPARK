package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Entities.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskListRepository extends JpaRepository<TaskList, Integer> {
    List<TaskList> findByProject_ProjectId(int projectId);


    // ✅ JPQL을 사용하여 명시적으로 삭제 쿼리 작성
    @Modifying
    @Transactional
    @Query("DELETE FROM TaskList tl WHERE tl.project.projectId = :projectId")
    void deleteByProjectId(@Param("projectId") int projectId);


}
