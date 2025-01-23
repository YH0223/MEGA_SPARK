package com.jyh000223.mega_project.Controller;

import com.jyh000223.mega_project.DTO.UserDTO;
import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/insert")
    public String insertUser(@RequestBody UserDTO userdto) {
        User user = new User();
        user.setUser_id(userdto.getUser_id());
        user.setUser_name(userdto.getUser_name());
        user.setPassword(userdto.getPassword());
        user.setEmail_address(userdto.getEmail_address());
        userRepository.save(user);
        return "User inserted successfully!";
    }
}
