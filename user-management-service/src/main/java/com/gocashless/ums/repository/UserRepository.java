package com.gocashless.ums.repository;

import com.gocashless.ums.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByUsername(String username);
    boolean existsByPhoneNumber(String phoneNumber);
    java.util.List<User> findAllByRole(com.gocashless.ums.model.Role role);
    Optional<User> findByEmail(String email);
}
