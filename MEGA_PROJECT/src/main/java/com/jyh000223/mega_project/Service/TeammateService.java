package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.DTO.TeammateDTO;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Teammate;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TeammateRepository;
import com.jyh000223.mega_project.Repository.UserRepository; // ✅ 추가
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeammateService {
    private final TeammateRepository teammateRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository; // ✅ 추가

    public TeammateService(TeammateRepository teammateRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.teammateRepository = teammateRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository; // ✅ 초기화 추가
    }
    public boolean isUserExists(String userId) {
        return userRepository.existsByUserId(userId);
    }



    public boolean isTeammateExists(String userId, int projectId) {
        return teammateRepository.existsByUserIdAndProjectId(userId, projectId);
    }

    public List<TeammateDTO> getTeammatesByProject(int projectId) {
        List<Teammate> teammates = teammateRepository.findAllByProjectId(projectId);

        return teammates.stream()
                .map(teammate -> {
                    String userName = userRepository.findUserNameByUserId(teammate.getUserId())
                            .orElse("이름 없음"); // ✅ 기본값 처리
                    return new TeammateDTO(teammate.getUserId(), userName);
                })
                .collect(Collectors.toList());
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
