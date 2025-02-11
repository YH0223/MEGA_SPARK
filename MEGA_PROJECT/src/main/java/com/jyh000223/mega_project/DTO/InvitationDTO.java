package com.jyh000223.mega_project.DTO;

public class InvitationDTO {
    private int invitationId;
    private int projectId;
    private String inviterId;
    private String inviteeId;
    private String status;

    // ✅ 생성자
    public InvitationDTO(int invitationId, int projectId, String inviterId, String inviteeId, String status) {
        this.invitationId = invitationId;
        this.projectId = projectId;
        this.inviterId = inviterId;
        this.inviteeId = inviteeId;
        this.status = status;
    }

    // ✅ Getter & Setter
    public int getInvitationId() { return invitationId; }
    public void setInvitationId(int invitationId) { this.invitationId = invitationId; }
    public int getProjectId() { return projectId; }
    public void setProjectId(int projectId) { this.projectId = projectId; }
    public String getInviterId() { return inviterId; }
    public void setInviterId(String inviterId) { this.inviterId = inviterId; }
    public String getInviteeId() { return inviteeId; }
    public void setInviteeId(String inviteeId) { this.inviteeId = inviteeId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
