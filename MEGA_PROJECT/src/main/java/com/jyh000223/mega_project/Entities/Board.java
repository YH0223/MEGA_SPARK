package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "Board")
@Getter
@Setter
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 설정
    @Column(name="dashboard_id")
    private int dashboardId;
    @Column(name="project_id")
    private int projectId;
    @Column(name="user_id")
    private String userId;
    @Column(name="title")
    private String title;
    @Column(name="deadline")
    private LocalDate deadline;
}
