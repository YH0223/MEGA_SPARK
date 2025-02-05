package com.jyh000223.mega_project.Modules;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;

@RestController
@RequestMapping("/api")
public class AuthController {

    @GetMapping("/session")
    public ResponseEntity<String> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            System.out.println("❌ 세션 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 없음");
        }

        // ✅ 모든 세션 속성을 출력하여 user_id가 저장되었는지 확인
        System.out.println("✅ 세션 속성 확인:");
        for (Enumeration<String> e = session.getAttributeNames(); e.hasMoreElements();) {
            String name = e.nextElement();
            System.out.println(name + " : " + session.getAttribute(name));
        }

        // ✅ user_id 값 확인
        String userId = (String) session.getAttribute("user_id");
        if (userId == null) {
            System.out.println("❌ user_id가 세션에 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션에 user_id 없음");
        }

        System.out.println("✅ 현재 로그인된 사용자 ID: " + userId);
        return ResponseEntity.ok(userId);
    }

}
