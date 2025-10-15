package com.gocashless.ums.controller;

import com.gocashless.ums.dto.LoginRequest;
import com.gocashless.ums.model.Role;
import com.gocashless.ums.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest authenticationRequest, HttpServletRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String clientApp = request.getHeader("X-Client-App");
        User user = (User) userDetails;

        if (clientApp != null) {
            boolean roleMismatch = switch (clientApp) {
                case "PASSENGER_MOBILE" -> user.getRole() != Role.PASSENGER;
                case "CONDUCTOR_MOBILE" -> user.getRole() != Role.CONDUCTOR;
                case "ADMIN_WEB_DASHBOARD" -> user.getRole() != Role.GOCASHLESS_ADMIN;
                default -> false; // Allow other clients for now
            };

            if (roleMismatch) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        return ResponseEntity.ok(Map.of("message", "Login successful", "user", user));
    }
}
