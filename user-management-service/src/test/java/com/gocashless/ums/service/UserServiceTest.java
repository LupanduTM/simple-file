
package com.gocashless.ums.service;

import com.gocashless.ums.clients.NotificationServiceClient;
import com.gocashless.ums.dto.UserRegistrationRequest;
import com.gocashless.ums.model.Role;
import com.gocashless.ums.model.User;
import com.gocashless.ums.model.UserStatus;
import com.gocashless.ums.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private NotificationServiceClient notificationServiceClient;

    @InjectMocks
    private UserService userService;

    private UserRegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        registrationRequest = new UserRegistrationRequest();
        registrationRequest.setUsername("testuser");
        registrationRequest.setPassword("password123");
        registrationRequest.setEmail("testuser@example.com");
        registrationRequest.setPhoneNumber("1234567890");
        registrationRequest.setFirstName("Test");
        registrationRequest.setLastName("User");
    }

    @Test
    void shouldRegisterPassengerSuccessfully() {
        // Given: The username and phone number are not already in use
        when(userRepository.existsByUsername(registrationRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByPhoneNumber(registrationRequest.getPhoneNumber())).thenReturn(false);

        // Given: The password encoder will return a hashed password
        String hashedPassword = "hashedPassword123";
        when(passwordEncoder.encode(registrationRequest.getPassword())).thenReturn(hashedPassword);

        // Given: The repository will return a saved user when save is called
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        when(userRepository.save(userCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        // When: We register a new passenger
        User result = userService.registerPassenger(registrationRequest);

        // Then: The returned user should not be null
        assertNotNull(result);

        // And: The user's details should match the request and be set correctly
        User capturedUser = userCaptor.getValue();
        assertEquals(registrationRequest.getUsername(), capturedUser.getUsername());
        assertEquals(hashedPassword, capturedUser.getPasswordHash()); // Verify password was encoded
        assertEquals(registrationRequest.getEmail(), capturedUser.getEmail());
        assertEquals(Role.PASSENGER, capturedUser.getRole());
        assertEquals(UserStatus.ACTIVE, capturedUser.getStatus());

        // And: The password encoder was called with the plain password
        verify(passwordEncoder).encode(registrationRequest.getPassword());

        // And: The welcome notification was sent
        verify(notificationServiceClient).sendPassengerWelcomeEmail(any());
    }

    @Test
    void shouldThrowExceptionWhenPhoneNumberAlreadyExists() {
        // Given: The username is not in use, but the phone number is.
        when(userRepository.existsByUsername(registrationRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByPhoneNumber(registrationRequest.getPhoneNumber())).thenReturn(true);

        // When & Then: We attempt to register, and expect an IllegalArgumentException to be thrown.
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.registerPassenger(registrationRequest);
        });

        // And: The exception message should be correct.
        assertEquals("Phone number already registered.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenUsernameAlreadyExists() {
        // Given: The username is already in use
        when(userRepository.existsByUsername(registrationRequest.getUsername())).thenReturn(true);

        // When & Then: We attempt to register, and expect an IllegalArgumentException to be thrown.
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.registerPassenger(registrationRequest);
        });

        // And: The exception message should be correct.
        assertEquals("Username already exists.", exception.getMessage());
    }
}
