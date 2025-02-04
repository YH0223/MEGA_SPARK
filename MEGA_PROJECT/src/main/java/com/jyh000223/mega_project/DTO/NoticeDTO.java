package com.jyh000223.mega_project.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NoticeDTO {
    @JsonProperty("noticeTitle")
    private String notice_title;

    @JsonProperty("noticeContext")
    private String notice_context;

    @JsonProperty("projectId")
    private int project_id;

    public String getNotice_title() { return notice_title; }
    public void setNotice_title(String notice_title) { this.notice_title = notice_title; }

    public String getNotice_context() { return notice_context; }
    public void setNotice_context(String notice_context) { this.notice_context = notice_context; }

    public int getProject_id() { return project_id; }
    public void setProject_id(int project_id) { this.project_id = project_id; }
}
