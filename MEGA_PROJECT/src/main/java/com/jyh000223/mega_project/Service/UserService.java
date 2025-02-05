package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.Entities.User;
import com.jyh000223.mega_project.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** ✅ 사용자 이름으로 검색 */
    public List<User> searchUsersByName(String searchQuery) {
        return userRepository.findByUserNameContainingIgnoreCase(searchQuery);
    }
}
