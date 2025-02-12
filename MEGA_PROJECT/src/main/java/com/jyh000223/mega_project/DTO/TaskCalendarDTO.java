package com.jyh000223.mega_project.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskCalendarDTO {
    private int taskId;       // ✅ key로 사용할 taskId 추가
    private String taskName;
    private LocalDate startDate;
    private LocalDate deadline;
    private boolean checking;
    private int priority;
}
