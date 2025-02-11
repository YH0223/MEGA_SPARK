package com.jyh000223.mega_project.Repository;


import com.jyh000223.mega_project.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserName(String userId);

    boolean existsByUserId(String userId);

    Optional<User> findByUserId(String userId); // ✅ user_id 기반으로 사용자 조회

    List<User> findByUserNameContainingIgnoreCase(String searchQuery);

    List<User> findByUserIdContaining(String query);

    @Query("SELECT u.userName FROM User u WHERE u.userId = :userId")
    Optional<String> findUserNameByUserId(@Param("userId") String userId);
}
