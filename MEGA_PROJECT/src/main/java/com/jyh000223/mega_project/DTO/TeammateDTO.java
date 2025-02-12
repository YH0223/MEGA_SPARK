package com.jyh000223.mega_project.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeammateDTO {
    private int projectId;
    private String userId;
    private String projectManager;
    private String userName;
    // 생성자
    public TeammateDTO(String userId, String userName) {
        this.userId = userId;
        this.userName = userName;
    }
}
