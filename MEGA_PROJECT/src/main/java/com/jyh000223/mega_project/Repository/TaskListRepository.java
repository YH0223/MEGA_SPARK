package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Entities.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskListRepository extends JpaRepository<TaskList, Integer> {
    List<TaskList> findByProject_ProjectId(int projectId);
}
