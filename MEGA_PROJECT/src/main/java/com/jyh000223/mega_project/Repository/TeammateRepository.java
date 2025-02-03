package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Teammate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeammateRepository extends JpaRepository<Teammate, Integer> {
    Teammate findByUserId(String userId);

    Teammate findByProjectId(int projectId);

    Teammate findByUserIdAndProjectId(String userId, int projectId);
    List<Teammate> findAllByUserId(String userId);
}
