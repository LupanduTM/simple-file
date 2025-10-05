package com.gocashless.notification.service;

import com.gocashless.notification.dto.ConductorNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendLoginCredentials(ConductorNotification notification) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@gocashless.com");
        message.setTo(notification.getEmail());
        message.setSubject("Your GoCashless Conductor Account Credentials");
        message.setText("Welcome to GoCashless!\n\nYour login credentials are:\nEmail: " + notification.getEmail() + "\nPassword: " + notification.getPassword() + "\n\nPlease change your password after your first login.");
        mailSender.send(message);
    }
}
