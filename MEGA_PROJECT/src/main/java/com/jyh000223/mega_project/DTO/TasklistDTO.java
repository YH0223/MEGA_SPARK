package com.jyh000223.mega_project.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

import java.time.LocalDate;

public class TasklistDTO {
    private int tasklistId;
    private String tasklistName;
    private int projectId;

    // 기본 생성자
    public TasklistDTO() {}

    // 모든 필드를 포함하는 생성자
    public TasklistDTO(int tasklistId, String tasklistName, int projectId) {
        this.tasklistId = tasklistId;
        this.tasklistName = tasklistName;
        this.projectId = projectId;
    }


    // Getter 및 Setter 메서드
    public int getTasklistId() {
        return tasklistId;
    }

    public void setTasklistId(int tasklistId) {
        this.tasklistId = tasklistId;
    }

    public String getTasklistName() {
        return tasklistName;
    }

    public void setTasklistName(String tasklistName) {
        this.tasklistName = tasklistName;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }



    @Override
    public String toString() {
        return "TasklistDTO{" +
                "tasklistId=" + tasklistId +
                ", tasklistName='" + tasklistName + '\'' +
                ", projectId=" + projectId +
                '}';
    }
}
