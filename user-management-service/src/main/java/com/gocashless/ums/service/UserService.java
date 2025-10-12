package com.gocashless.ums.service;

import com.gocashless.ums.config.RabbitMQConfig;
import com.gocashless.ums.dto.ConductorNotification;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.gocashless.ums.dto.UserUpdateRequest;
import com.gocashless.ums.model.User;
import com.gocashless.ums.model.Role;
import com.gocashless.ums.dto.UserRegistrationRequest;
import com.gocashless.ums.model.UserStatus;
import com.gocashless.ums.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public User registerUser(UserRegistrationRequest request, Role role) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already registered.");
        }

        String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE); // Default status

        User savedUser = userRepository.save(user);

        if (role == Role.CONDUCTOR) {
            ConductorNotification notification = new ConductorNotification(savedUser.getEmail(), temporaryPassword);
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "notification.email", notification);
        }

        return savedUser;
    }

    public Optional<User> findUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());

        return userRepository.save(user);
    }

    public void resetPassword(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        user.setPasswordHash(passwordEncoder.encode("gocashless"));
        userRepository.save(user);
    }

    public java.util.List<User> getAllConductors() {
        return userRepository.findAllByRole(Role.CONDUCTOR);
    }

    public java.util.List<User> getAllPassengers() {
        return userRepository.findAllByRole(Role.PASSENGER);
    }

    public java.util.List<User> getAllAdmins() {
        return userRepository.findAllByRole(Role.GOCASHLESS_ADMIN);
    }

    public User updateUserStatus(UUID id, UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setStatus(status);
        return userRepository.save(user);
    }
}
