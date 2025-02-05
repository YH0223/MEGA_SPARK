package com.jyh000223.mega_project.Controller;
import com.jyh000223.mega_project.DTO.UserDTO;
import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<String> insertUser(HttpServletRequest request, @RequestBody UserDTO userdto) {
        String password = userdto.getPassword();
        String user_id = userdto.getUser_id();

        boolean isAuthenticated = authenticate(user_id, password);
        if (isAuthenticated) {
            HttpSession session = request.getSession(true); // 기존 세션이 있으면 가져오고, 없으면 새로 생성
            session.setAttribute("user_id", user_id);  // 세션에 사용자 ID 저장

            System.out.println("✅ 로그인 성공! 세션 ID: " + session.getId());
            System.out.println("✅ 세션에 저장된 user_id: " + session.getAttribute("user_id"));

            return ResponseEntity.ok("200");
        } else {
            return ResponseEntity.status(400).body("Unauthorized");
        }
    }


    // 사용자 인증을 수행하는 메서드 (임시로 비밀번호 비교만)
    private boolean authenticate(String user_id, String password) {
        User user = userRepository.findByUserName(user_id);
        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        return user != null && user.getPassword().equals(password);
    }




}

