package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Service
public class ProfileService {
    private final UserRepository userRepository;
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "user_upload" + File.separator;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** ✅ 프로필 업데이트 (save 대신 update) */
    @Transactional
    public User updateProfile(String userId, String userName, String email, MultipartFile profileImage) throws IOException {
        System.out.println("🔍 업데이트할 userId: " + userId);

        // ✅ 유저 조회 (Optional 사용)
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        user.setUserName(userName);
        user.setEmail_address(email);

        System.out.println("✅ 기존 사용자 이름: " + user.getUserName());

        // ✅ 프로필 이미지 저장 처리
        if (profileImage != null && !profileImage.isEmpty()) {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // ✅ 기존 이미지 삭제 (중복 방지)
            if (user.getImg_url() != null) {
                File oldFile = new File(UPLOAD_DIR + user.getImg_url());
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            // ✅ 새 파일 저장 (파일명 중복 방지)
            String fileName = "profile_" + userId + "_" + System.nanoTime() + "_" + profileImage.getOriginalFilename();
            File destinationFile = new File(UPLOAD_DIR + fileName);
            profileImage.transferTo(destinationFile);

            // ✅ DB에 상대 경로 저장
            user.setImg_url(fileName);
        }

        return userRepository.save(user); // ✅ JPA가 변경 감지하여 자동 저장
    }

    /** ✅ 프로필 조회 */
    public Optional<User> getProfileByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }
}
