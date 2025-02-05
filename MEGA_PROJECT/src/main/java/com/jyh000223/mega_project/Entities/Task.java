package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
