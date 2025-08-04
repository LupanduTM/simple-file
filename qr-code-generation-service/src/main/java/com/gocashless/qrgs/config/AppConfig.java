package com.gocashless.qrgs.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    /**
     * Configures a LoadBalanced RestTemplate for inter-service communication.
     * This allows using Eureka service names (e.g., "ROUTE-FARE-MANAGEMENT-SERVICE")
     * instead of direct host:port when making HTTP calls to other microservices.
     */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}