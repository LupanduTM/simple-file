package com.gocashless.notification.listener;

import com.gocashless.notification.config.RabbitMQConfig;
import com.gocashless.notification.dto.ConductorNotification;
import com.gocashless.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationListener {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receiveMessage(ConductorNotification notification) {
        emailService.sendLoginCredentials(notification);
    }
}
