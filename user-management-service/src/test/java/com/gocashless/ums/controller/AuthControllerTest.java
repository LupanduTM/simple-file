package com.gocashless.ums.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gocashless.ums.dto.LoginRequest;
import com.gocashless.ums.model.Role;
import com.gocashless.ums.model.User;
import com.gocashless.ums.model.UserStatus;
import com.gocashless.ums.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    // We need to mock UserService because it implements UserDetailsService,
    // which is required by the security configuration.
    @MockBean
    private UserService userService;

    @Test
    void shouldLoginSuccessfullyWithValidCredentials() throws Exception {
        // Given: A valid login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // And: A mock user principal that the AuthenticationManager will return
        User mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("test@example.com");
        mockUser.setUsername("testuser");
        mockUser.setRole(Role.PASSENGER);
        mockUser.setStatus(UserStatus.ACTIVE);

        Authentication mockAuthentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());

        // And: We configure the mock AuthenticationManager to return our mock authentication
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuthentication);

        // When & Then: We perform a POST request to the login endpoint
        mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk()) // Expect HTTP 200 OK
                .andExpect(jsonPath("$.message").value("Login successful")) // Check for success message
                .andExpect(jsonPath("$.user.email").value("test@example.com")); // Check for user data in response
    }

    @Test
    void shouldReturnUnauthorizedWithInvalidCredentials() throws Exception {
        // Given: A valid login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongpassword");

        // And: We configure the mock AuthenticationManager to throw an exception, simulating a failed login
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid Credentials"));

        // When & Then: We perform a POST request to the login endpoint
        mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized()) // Expect HTTP 401 Unauthorized
                .andExpect(jsonPath("$.error").value("Invalid credentials")); // Check for error message
    }
}
