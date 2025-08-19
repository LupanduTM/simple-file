package com.gocashless.ums.controller;

import com.gocashless.ums.dto.UserRegistrationRequest;
import com.gocashless.ums.dto.UserUpdateRequest;
import com.gocashless.ums.model.Role;
import com.gocashless.ums.model.User;
import com.gocashless.ums.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/passenger")
    public ResponseEntity<?> registerPassenger(@RequestBody UserRegistrationRequest request) {
        try {
            User newUser = userService.registerUser(request, Role.PASSENGER);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/register/buscompany")
    public ResponseEntity<?> registerBusCompany(@RequestBody UserRegistrationRequest request) {
        try {
            User newUser = userService.registerUser(request, Role.BUS_COMPANY_ADMIN);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/register/conductor")
    public ResponseEntity<?> registerConductor(@RequestBody UserRegistrationRequest request) {
        try {
            User newUser = userService.registerUser(request, Role.CONDUCTOR);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        return userService.findUserById(id)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody UserUpdateRequest request) {
        try {
            User updatedUser = userService.updateUser(id, request);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add endpoints for updating users, managing conductors/bus companies, etc.

    @GetMapping("/bus-companies/{companyId}/conductors")
    public ResponseEntity<?> getConductorsByBusCompany(@PathVariable UUID companyId) {
        var conductors = userService.getConductorsByBusCompanyId(companyId);
        return new ResponseEntity<>(conductors, HttpStatus.OK);
    }
}

