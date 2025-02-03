package com.jyh000223.mega_project.DTO;

import java.time.LocalDate;

public class ProjectCalendarDTO {
    private int projectId;
    private String projectName;
    private LocalDate startDate;
    private LocalDate deadline;

    public ProjectCalendarDTO(int projectId, String projectName, LocalDate startDate, LocalDate deadline) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.startDate = startDate;
        this.deadline = deadline;
    }

    // Getter
    public int getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getDeadline() { return deadline; }
}
