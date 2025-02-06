package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Integer> {


    Optional<Project> findByProjectName(String projectName);

    Project findByprojectId(int projectId);

    Project findByProjectId(int projectId);

    List<Project> findAllByProjectIdIn(List<Integer> projectIds);

    List<Project> findByProjectManager(String userName);
}
