package com.jyh000223.mega_project.Entities;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class Invitation {
    // Getter & Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String inviterId;
    private String inviteeId;
    private int projectId;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status = InvitationStatus.PENDING;

    public void setId(int id) { this.id = id; }

    public void setInviterId(String inviterId) { this.inviterId = inviterId; }


    public void setInviteeId(String inviteeId) { this.inviteeId = inviteeId; }

    public void setProjectId(int projectId) { this.projectId = projectId; }

    public void setStatus(InvitationStatus status) { this.status = status; }


    public int getInvitationId() {
        return id;
    }
}
