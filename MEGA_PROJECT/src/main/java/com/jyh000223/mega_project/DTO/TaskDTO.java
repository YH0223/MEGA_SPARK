package com.jyh000223.mega_project.DTO;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TaskDTO {
    @JsonProperty("taskName")  // ✅ JSON에서 "taskName"을 받아 "task_name"에 매핑
    private String task_name;

    private boolean checking;

    @JsonProperty("projectId")  // ✅ JSON에서 "projectId"를 받아 "project_id"에 매핑
    private int project_id;

    public String getTask_name() { return task_name; }
    public void setTask_name(String task_name) { this.task_name = task_name; }

    public boolean isChecking() { return checking; }
    public void setChecking(boolean checking) { this.checking = checking; }

    public int getProject_id() { return project_id; }
    public void setProject_id(int project_id) { this.project_id = project_id; }
}