package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.UserDTO;
import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Repository.UserRepository;
import com.jyh000223.mega_project.Service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class        UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> insertUser(@RequestBody UserDTO userdto) {
        if (userdto.getUser_id() == null || userdto.getUser_id().isEmpty()) {
            return ResponseEntity.badRequest().body("User ID is required.");
        }

        // ✅ ID 중복 체크
        if (userRepository.existsByUserId(userdto.getUser_id())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User ID already exists.");
        }

        User user = new User();
        user.setUserId(userdto.getUser_id());
        user.setUserName(userdto.getUser_name());
        user.setPassword(userdto.getPassword());
        user.setEmail_address(userdto.getEmail_address());

        userRepository.save(user);
        return ResponseEntity.ok("User inserted successfully!");
    }

    @GetMapping("/searchUsers")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userRepository.findByUserIdContaining(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String search, HttpSession session) {
        String currentUser = (String) session.getAttribute("user_id");
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<User> users = userService.searchUsersByName(search);
        return ResponseEntity.ok(users);
    }



}

