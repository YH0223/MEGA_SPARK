package com.jyh000223.mega_project.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@Builder
public class TaskDTO {
    // ✅ taskId 추가
    private int taskId;
    @JsonProperty("taskName")
    private String taskName;

    private boolean checking;

    @JsonProperty("projectId")
    private int projectId;
    private String userName;
    @JsonProperty("tasklistId") // ✅ 추가: Task가 속한 TaskList의 ID를 JSON과 매핑
    private int tasklistId;

    private String userId;
    private LocalDate startDate;
    private LocalDate deadline;
    private int priority;
    private String tasklistName;




}
