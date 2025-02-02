package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class CalendarController {

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping
    public List<Project> getProjectsByUserId(HttpServletRequest request) {
        HttpSession session = request.getSession();
        Integer userId = (Integer) session.getAttribute("user_id");  // 세션에서 user_id 가져오기

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing in session.");
        }

        // 해당 유저 ID에 맞는 프로젝트들을 조회
        return projectRepository.findAllByUserId(userId);
    }
}
