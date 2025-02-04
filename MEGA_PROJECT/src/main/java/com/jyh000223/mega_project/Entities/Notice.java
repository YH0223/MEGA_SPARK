package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Getter
@Setter
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="notice_id")
    private int noticeId;

    @Column(name="notice_title", nullable = false)
    private String noticeTitle;

    @Column(name="notice_context", nullable = false)
    private String noticeContext;

    @Column(name="notice_created_at", nullable = false, updatable = false)
    private LocalDateTime noticeCreatedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
