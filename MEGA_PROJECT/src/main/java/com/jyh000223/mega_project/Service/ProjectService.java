package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
    private Project project;
    private final ProjectRepository projectRepository;
    @Autowired
    private TaskRepository taskRepository;
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public String getProjectManagerByProjectName(String projectName) {
        // Optional로 처리
        return projectRepository.findByProjectName(projectName)
                .map(Project::getProjectManager)
                .orElse(null); // 값이 없을 경우 null 반환
    }

}
