package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {


    Optional<Project> findByProjectName(String projectName);
}
