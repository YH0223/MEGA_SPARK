package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Repository.UserRepository;
import com.jyh000223.mega_project.Service.ProfileService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class ProfileController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileService profileService;

    // ✅ 파일 저장 경로 (`user_upload` 폴더)
    private static final String STATIC_IMAGE_DIR = System.getProperty("user.dir") + File.separator + "user_upload" + File.separator;

    /** ✅ 프로필 조회 */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getProfile(HttpSession session) {
        String userId = (String) session.getAttribute("user_id");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<User> userOpt = profileService.getProfileByUserId(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // ✅ 프로필 데이터 응답
        Map<String, String> profileData = new HashMap<>();
        profileData.put("userName", user.getUserName());
        profileData.put("email", user.getEmail_address());

        // ✅ 저장된 프로필 이미지 전체 URL 반환 (프론트에서 직접 접근 가능하게 설정)
        String imageUrl;
        if (user.getImg_url() != null && !user.getImg_url().isEmpty()) {
            imageUrl = "http://localhost:8080/api/user/profile/image/" + user.getImg_url();
        } else {
            imageUrl = "http://localhost:8080/user_upload/default_profile.png"; // 기본 이미지
        }

        profileData.put("img_url", imageUrl);

        return ResponseEntity.ok(profileData);
    }


    /** ✅ 프로필 저장 및 이미지 업로드 (POST) */
    @Transactional
    @PostMapping("/saveProfile")
    public ResponseEntity<?> saveProfile(
            HttpSession session,
            @RequestParam("userName") String userName,
            @RequestParam("email") String email,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        String userId = (String) session.getAttribute("user_id");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        user.setUserName(userName);
        user.setEmail_address(email);

        // ✅ 프로필 이미지 저장
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                // 📌 `user_upload` 폴더 생성 (없으면 자동 생성)
                File uploadDir = new File(STATIC_IMAGE_DIR);
                if (!uploadDir.exists()) uploadDir.mkdirs();

                // 📌 기존 이미지 삭제 (파일 존재 시)
                if (user.getImg_url() != null) {
                    File oldFile = new File(STATIC_IMAGE_DIR + user.getImg_url());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }

                // 📌 새 파일 저장 (파일명 충돌 방지)
                String fileName = "profile_" + userId + "_" + System.nanoTime() + "_" + profileImage.getOriginalFilename();
                File destinationFile = new File(STATIC_IMAGE_DIR + fileName);
                profileImage.transferTo(destinationFile);

                // 📌 DB에는 파일명만 저장
                user.setImg_url(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("파일 저장 중 오류 발생: " + e.getMessage());
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    /** ✅ 프로필 이미지 제공 */
    @GetMapping("/profile/image/{filename}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get(STATIC_IMAGE_DIR + filename);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            String contentType = "image/jpeg"; // 기본값 (JPG)
            if (filename.endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.endsWith(".gif")) {
                contentType = "image/gif";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } else {
            // ✅ 기본 프로필 이미지 제공
            try {
                Resource defaultResource = new UrlResource(Paths.get(STATIC_IMAGE_DIR + "default_profile.png").toUri());
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"default_profile.png\"")
                        .body(defaultResource);
            } catch (MalformedURLException e) {
                return ResponseEntity.notFound().build();
            }
        }
    }

}
