package com.jyh000223.mega_project.Repository;


import com.jyh000223.mega_project.Entities.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserName(String userId);

    boolean existsByUserId(String userId);

    List<User> findByUserIdContaining(String query); // ✅ userId 검색 메서드 추가

    List<User> findByUserNameContainingIgnoreCase(String searchQuery);
}
