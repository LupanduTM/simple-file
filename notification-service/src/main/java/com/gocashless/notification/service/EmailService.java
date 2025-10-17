package com.gocashless.notification.service;

import com.gocashless.notification.dto.ConductorNotification;
import com.gocashless.notification.dto.PassengerNotification;
import com.gocashless.notification.dto.PasswordResetNotification;
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

    public void sendPassengerWelcomeEmail(PassengerNotification notification) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@gocashless.com");
        message.setTo(notification.getEmail());
        message.setSubject("Welcome to GoCashless — Your Passenger Account Is Ready");
        message.setText("Dear " + notification.getFirstName() + " " + notification.getLastName() + ",\n\nWe are pleased to confirm that your GoCashless passenger account has been successfully created.\n\nAccount details•Registered email: " + notification.getEmail() + "•Account status: Active•Registration date: " + notification.getRegistrationDate() + "\n\nYou can now sign in to the GoCashless app to: Pay for rides securely, and review your recent transactions.\n\nIf you did not create this account, please contact our support team immediately.\n\nKind regards,\nGoCashless SupportEmail: support@gocashless.com | Phone: +260 763 576 462");
        mailSender.send(message);
    }

    public void sendPasswordResetNotification(PasswordResetNotification notification) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@gocashless.com");
        message.setTo(notification.getEmail());
        message.setSubject("Your GoCashless Password Has Been Reset");
        message.setText("Dear User,\n\nYour password for your GoCashless account has been successfully reset.\n\nHere is your new password: " + notification.getPassword() + "\n\nFor security reasons, we strongly recommend that you change this password after your next login.\n\nIf you did not request this password reset, please contact our support team immediately.\n\nKind regards,\nGoCashless Support\nEmail: support@gocashless.com | Phone: +260 763 576 462");
        mailSender.send(message);
    }
}
