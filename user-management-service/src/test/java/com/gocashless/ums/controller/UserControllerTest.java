package com.gocashless.ums.controller;

import com.gocashless.ums.model.Role;
import com.gocashless.ums.model.User;
import com.gocashless.ums.model.UserStatus;
import com.gocashless.ums.repository.UserRepository;
import com.gocashless.ums.clients.NotificationServiceClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {"spring.cloud.discovery.enabled=false"})
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private NotificationServiceClient notificationServiceClient;

    @Test
    @WithMockUser(username = "testuser@example.com", roles = {"PASSENGER"})
    void shouldReturnCurrentUserForMeEndpoint() throws Exception {
        User mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("testuser@example.com");
        mockUser.setUsername("testuser");
        mockUser.setRole(Role.PASSENGER);
        when(userRepository.findByEmail("testuser@example.com")).thenReturn(Optional.of(mockUser));

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("testuser@example.com"));
    }


    @Test
    @WithMockUser(roles = "PASSENGER")
    void shouldReturnForbiddenForAdminEndpointWhenNotAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/users/admins"))
                .andExpect(status().isForbidden());
    }
}
