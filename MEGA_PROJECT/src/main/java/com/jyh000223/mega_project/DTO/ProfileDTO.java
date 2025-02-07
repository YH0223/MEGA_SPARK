package com.jyh000223.mega_project.DTO;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProfileDTO {
    private String userId;
    private String userName;
    private String email;
    private String img_url;
}

