package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import jakarta.transaction.Transactional;

@Service
public class ProfileService {
    private final UserRepository userRepository;
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/user_upload/";

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** ✅ 프로필 업데이트 (save 대신 update) */
    @Transactional // ✅ 트랜잭션 추가하여 JPA가 변경 감지 후 업데이트 수행
    public User updateProfile(String userId, String userName, String email, MultipartFile profileImage) throws IOException {
        System.out.println("🔍 업데이트할 userId: " + userId);

        // ✅ Optional을 사용하지 않고 직접 조회
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("유저를 찾을 수 없습니다.");
        }

        user.setUserName(userName);
        user.setEmail_address(email);
        System.out.println("✅ 기존 사용자 이름: " + user.getUserName());

        if (profileImage != null && !profileImage.isEmpty()) {
            String fileName = "profile_" + userId + "_" + profileImage.getOriginalFilename();
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            File destinationFile = new File(UPLOAD_DIR + fileName);
            profileImage.transferTo(destinationFile);

            user.setImg_url("/user_upload/" + fileName);
        }

        System.out.println("✅ 업데이트된 사용자 정보: " + user.getUserName() + ", 이메일: " + user.getEmail_address());

        return userRepository.save(user); // ✅ 기존 데이터를 업데이트
    }


    /** ✅ 프로필 조회 */
    public User getProfileByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }
}
