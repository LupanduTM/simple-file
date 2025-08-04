package com.gocashless.ums.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for API endpoints
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/users/register/**", "/api/v1/users/login", "/api/v1/users/**").permitAll() // Allow public access to registration and login
                        .anyRequest().authenticated() // All other requests require authentication
                );
        // You would add JWT filter here later
        return http.build();
    }
}