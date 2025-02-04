package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByProject_ProjectId(int projectId);
}
