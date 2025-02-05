package com.jyh000223.mega_project.Repository;


import com.jyh000223.mega_project.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserName(String userId);

    boolean existsByUserId(String userId);

    List<User> findByUserNameContainingIgnoreCase(String searchQuery);
}
