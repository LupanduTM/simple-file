
package com.gocashless.notification.service;

import com.gocashless.notification.dto.ConductorNotification;
import com.gocashless.notification.dto.PassengerNotification;
import com.gocashless.notification.dto.PasswordResetNotification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

public class EmailServiceTest {

    @InjectMocks
    private EmailService emailService;

    @Mock
    private JavaMailSender mailSender;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendLoginCredentials() {
        // Given
        ConductorNotification notification = new ConductorNotification();
        notification.setEmail("test@example.com");
        notification.setPassword("password");

        // When
        emailService.sendLoginCredentials(notification);

        // Then
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertEquals("noreply@gocashless.com", sentMessage.getFrom());
        assertEquals("test@example.com", sentMessage.getTo()[0]);
        assertEquals("Your GoCashless Conductor Account Credentials", sentMessage.getSubject());
        assertEquals("Welcome to GoCashless!\n\nYour login credentials are:\nEmail: test@example.com\nPassword: password\n\nPlease change your password after your first login.", sentMessage.getText());
    }

    @Test
    public void testSendPassengerWelcomeEmail() {
        // Given
        PassengerNotification notification = new PassengerNotification();
        notification.setEmail("test@example.com");
        notification.setFirstName("John");
        notification.setLastName("Doe");
        notification.setRegistrationDate(LocalDate.of(2025, 10, 25));

        // When
        emailService.sendPassengerWelcomeEmail(notification);

        // Then
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertEquals("noreply@gocashless.com", sentMessage.getFrom());
        assertEquals("test@example.com", sentMessage.getTo()[0]);
        assertEquals("Welcome to GoCashless — Your Passenger Account Is Ready", sentMessage.getSubject());
        assertEquals("Dear John Doe,\n\nWe are pleased to confirm that your GoCashless passenger account has been successfully created.\n\nAccount details•Registered email: test@example.com•Account status: Active•Registration date: 2025-10-25\n\nYou can now sign in to the GoCashless app to: Pay for rides securely, and review your recent transactions.\n\nIf you did not create this account, please contact our support team immediately.\n\nKind regards,\nGoCashless SupportEmail: support@gocashless.com | Phone: +260 763 576 462", sentMessage.getText());
    }

    @Test
    public void testSendPasswordResetNotification() {
        // Given
        PasswordResetNotification notification = new PasswordResetNotification();
        notification.setEmail("test@example.com");
        notification.setPassword("new_password");

        // When
        emailService.sendPasswordResetNotification(notification);

        // Then
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertEquals("noreply@gocashless.com", sentMessage.getFrom());
        assertEquals("test@example.com", sentMessage.getTo()[0]);
        assertEquals("Your GoCashless Password Has Been Reset", sentMessage.getSubject());
        assertEquals("Dear User,\n\nYour password for your GoCashless account has been successfully reset.\n\nHere is your new password: new_password\n\nFor security reasons, we strongly recommend that you change this password after your next login.\n\nIf you did not request this password reset, please contact our support team immediately.\n\nKind regards,\nGoCashless Support\nEmail: support@gocashless.com | Phone: +260 763 576 462", sentMessage.getText());
    }
}

