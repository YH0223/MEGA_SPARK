package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Teammate;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TeammateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeammateService {
    private final TeammateRepository teammateRepository;
    private final ProjectRepository projectRepository;

    public TeammateService(TeammateRepository teammateRepository, ProjectRepository projectRepository) {
        this.teammateRepository = teammateRepository;
        this.projectRepository = projectRepository;
    }

    public boolean isTeammateExists(String userId, int projectId) {
        return teammateRepository.existsByUserIdAndProjectId(userId, projectId);
    }

    /** ✅ 특정 프로젝트의 팀원 목록 조회 */
    public List<Teammate> getTeammatesByProject(int projectId) {
        return teammateRepository.findAllByProjectId(projectId);
    }

    public String addTeammate(String userId, int projectId) {
        Project project = projectRepository.findByProjectId(projectId);
        if (project == null) {
            return "404";
        }

        Teammate teammate = new Teammate();
        teammate.setUserId(userId);
        teammate.setProjectId(projectId);
        teammate.setProjectManager(project.getProjectManager());

        teammateRepository.save(teammate);
        return "200";
    }

    public String deleteTeammate(String userId, int projectId, String currentUser) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return "404";
        }

        Teammate teammate = teammateRepository.findByUserIdAndProjectId(userId, projectId);
        if (teammate == null) {
            return "404";
        }

        boolean isProjectManager = project.getProjectManager().equals(currentUser);
        boolean isSelf = userId.equals(currentUser);

        if (!isProjectManager && !isSelf) {
            return "403";
        }

        teammateRepository.delete(teammate);
        return "200";
    }
}
