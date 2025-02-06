package com.jyh000223.mega_project.DTO;

import java.time.LocalDate;

public class ProjectDTO {
    private int projectId;
    private String projectName;
    private String projectManager;
    private LocalDate startdate;
    private LocalDate deadline;

    public ProjectDTO(int projectId, String projectName, String projectManager, LocalDate startdate, LocalDate deadline) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectManager = projectManager;
        this.startdate = startdate;
        this.deadline = deadline;
    }

    public int getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }
    public String getProjectManager() { return projectManager; }
    public LocalDate getStartdate() { return startdate; }
    public LocalDate getDeadline() { return deadline; }
}

