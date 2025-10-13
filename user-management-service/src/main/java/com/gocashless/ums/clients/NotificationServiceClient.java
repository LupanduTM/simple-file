package com.gocashless.ums.clients;

import com.gocashless.ums.dto.ConductorNotification;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", path = "/api/v1/notifications")
public interface NotificationServiceClient {

    @PostMapping("/send-credentials")
    void sendCredentials(@RequestBody ConductorNotification notification);
}
