package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "tasklist")
@Getter
@Setter
public class TaskList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tasklist_id")
    private int tasklistId;

    @Column(name="tasklist_name", nullable = false)
    private String tasklistName;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

}