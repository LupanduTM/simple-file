package com.gocashless.ums.dto;

import lombok.Data;

@Data
public class UserRegistrationRequest {
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
}
