package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "teammate")
@Getter
@Setter
public class Teammate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 설정
    @Column(name="index_team")
    private int indexTeam;

    @Column(name="project_id")
    private int projectId;
    @Column(name="user_id")
    private String userId;
    @Column(name="startdate")
    private LocalDate startdate;
    @Column(name="deadline")
    private LocalDate deadline;
    @Column(name = "project_manager")
    private String projectManager;


}
