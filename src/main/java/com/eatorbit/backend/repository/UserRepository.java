package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.Role;
import com.eatorbit.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByStatus(com.eatorbit.backend.model.UserStatus status);

    List<User> findByRoleAndStatus(Role role, com.eatorbit.backend.model.UserStatus status);

    List<User> findByRole(Role role);
}
