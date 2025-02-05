package com.jyh000223.mega_project.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class ProjectCalendarDTO {
    private int projectId;
    private String projectName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    LocalDate startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    LocalDate deadline;

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
