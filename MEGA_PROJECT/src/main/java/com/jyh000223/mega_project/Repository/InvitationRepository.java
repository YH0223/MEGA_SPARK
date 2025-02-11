package com.jyh000223.mega_project.Repository;

import com.jyh000223.mega_project.Entities.Invitation;
import com.jyh000223.mega_project.Entities.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    List<Invitation> findByInviteeIdAndStatus(String inviteeId, InvitationStatus status);
    List<Invitation> findByProjectIdAndStatus(int projectId, InvitationStatus status);
}