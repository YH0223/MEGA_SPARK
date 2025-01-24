package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.ProjectDTO;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private HttpSession httpSession;
    @Autowired
    private ProjectService projectService;

    @PostMapping("/createproject")
    public ResponseEntity<String> createProject(@RequestBody ProjectDTO projectdto) {

        String project_name=projectdto.getProject_name();
        String project_manager=httpSession.getAttribute("user").toString();
        LocalDate startdate=projectdto.getStartdate();
        LocalDate deadline=projectdto.getDeadline();

        boolean makeable = checkProjname(project_name);  //프로젝트명 중복 비교
        if (makeable) {
            Project project = new Project();
            project.setProjectName(project_name);
            project.setProjectManager(project_manager);
            project.setStartdate(startdate);
            project.setDeadline(deadline);
            projectRepository.save(project);
            return ResponseEntity.ok("200");
        }else{
            return ResponseEntity.ok("400");
        }
    }

    private boolean checkProjname(String project_name) {
        Project project = projectRepository.findByProjectName(project_name)
                .orElse(null);
        return project != null;
    }
    @PostMapping("/deleteproject")
    public ResponseEntity<String> deleteProject(HttpServletRequest request, @RequestBody ProjectDTO projectdto) {

        String projectName = projectdto.getProject_name();

        // ProjectService를 통해 projectManager 가져오기
        String projectManager = projectService.getProjectManagerByProjectName(projectName);

        if (projectManager != null) {
            boolean makeable = checkProjname(projectName); // 프로젝트명 중복 비교
            if (makeable) {
                return ResponseEntity.ok("200");
            } else {
                return ResponseEntity.status(400).body("400");
            }
        } else {
            return ResponseEntity.status(404).body("Project not found");
        }
    }

}
