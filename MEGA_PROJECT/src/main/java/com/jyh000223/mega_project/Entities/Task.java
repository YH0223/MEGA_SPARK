package com.jyh000223.mega_project.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "task")
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="task_id")
    private int taskId;

    @Column(name="task_name", nullable = false)
    private String taskName;

    @Column(name="checking")
    private boolean checking;

    @ManyToOne
    @JoinColumn(name = "tasklist_id", nullable = false)
    @JsonIgnore  // ✅ Hibernate 프록시 문제 방지
    private TaskList taskList;

    @Column(name="startdate")
    private LocalDate startDate;

    @Column(name="deadline")
    private LocalDate deadline;

    @Column(name="priority")
    private int priority;

    @Column(name = "user_id")
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY) // ✅ Lazy Loading 설정
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // ✅ Hibernate 프록시 문제 방지
    private Project project;
}
