package com.gocashless.notification.controller;

import com.gocashless.notification.dto.ConductorNotification;
import com.gocashless.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/send-credentials")
    public void sendCredentials(@RequestBody ConductorNotification notification) {
        emailService.sendLoginCredentials(notification);
    }
}
