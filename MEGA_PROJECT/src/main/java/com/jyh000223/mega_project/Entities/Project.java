package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "PROJECT")
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 설정
    @Column(name="project_id")
    private int projectId;
    @Column(name="project_name")
    private String projectName;
    @Column(name="project_manager")
    private String projectManager;
    @Column(name="startdate")
    private LocalDate startdate;
    @Column(name="deadline")
    private LocalDate deadline;
}
