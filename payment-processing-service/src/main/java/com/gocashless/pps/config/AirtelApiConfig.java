package com.gocashless.pps.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "airtel.api")
@Data
public class AirtelApiConfig {
    private String clientId;
    private String clientSecret;
    private String disbursementPin;
    private String country;
    private String currency;
    private String environmentMode;

    // Derived property for base URL
    public String getBaseUrl() {
        return "production".equalsIgnoreCase(environmentMode) ?
                "https://openapi.airtel.africa" : "https://openapiuat.airtel.africa";
    }
}