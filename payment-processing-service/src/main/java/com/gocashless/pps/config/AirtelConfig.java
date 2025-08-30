package com.gocashless.pps.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "airtel")
public class AirtelConfig {
    private String baseUrl;
    private String clientId;
    private String clientSecret;
}
