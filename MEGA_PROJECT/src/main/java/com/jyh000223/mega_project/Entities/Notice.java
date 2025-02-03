package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "NOTICE")
@Getter
@Setter
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 설정
    @Column(name="notice_id")
    private int noticeId;
    @Column(name="project_id")
    private int projectId;
    @Column(name="context_notice")
    private String contextNotice;
}
