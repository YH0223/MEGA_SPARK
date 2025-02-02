package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Teammate;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TeammateRepository;
import org.springframework.stereotype.Service;

@Service
public class TeammateService {
    private final TeammateRepository teammateRepository;
    private final ProjectRepository projectRepository;

    // 생성자 주입
    public TeammateService(TeammateRepository teammateRepository, ProjectRepository projectRepository) {
        this.teammateRepository = teammateRepository;
        this.projectRepository = projectRepository;
    }

    public String addTeammate(String user_id, int project_id) {
        // 프로젝트 조회
        Project project = projectRepository.findByProjectId(project_id);
        if (project == null) {
            return "400"; // 프로젝트가 존재하지 않음
        }

        // 팀원 추가
        Teammate teammate = new Teammate();
        teammate.setUserId(user_id);
        teammate.setProjectId(project_id);
        teammate.setDeadline(project.getDeadline());
        teammate.setStartdate(project.getStartdate());
        teammate.setProjectManager(project.getProjectManager());

        // 저장
        teammateRepository.save(teammate);

        return "200"; // 성공
    }

    public String deleteTeammate(String userId, int projectId, String currentUser) {
        // 프로젝트 조회
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return "404"; // 프로젝트 없음
        }

        // 팀원 존재 여부 확인
        Teammate teammate = teammateRepository.findByUserIdAndProjectId(userId, projectId);
        if (teammate == null) {
            return "404"; // 팀원 없음
        }

        // 현재 사용자가 프로젝트 매니저인지 확인하거나 본인인지 확인
        boolean isProjectManager = project.getProjectManager().equals(currentUser);
        boolean isSelf = userId.equals(currentUser);

        if (!isProjectManager && !isSelf) {
            return "403"; // 권한 없음
        }

        // 팀원 삭제
        teammateRepository.delete(teammate);

        return "200"; // 성공
    }
}
