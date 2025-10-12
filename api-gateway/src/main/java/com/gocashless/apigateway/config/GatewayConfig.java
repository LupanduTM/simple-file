package com.gocashless.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-management-service-auth", r -> r.path("/api/v1/auth/**")
                        .uri("lb://USER-MANAGEMENT-SERVICE"))
                .route("user-management-service", r -> r.path("/api/v1/users/**")
                        .uri("lb://user-management-service"))
                .route("route-fare-management-service", r -> r.path("/api/v1/routes/**", "/api/v1/bus-stops/**", "/api/v1/fares/**")
                        .uri("lb://route-fare-management-service"))
                .route("qr-code-generation-service", r -> r.path("/api/v1/qr/**")
                        .uri("lb://qr-code-generation-service"))
                .build();
    }
}
