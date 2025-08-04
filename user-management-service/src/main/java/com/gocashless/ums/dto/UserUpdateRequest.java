package com.gocashless.ums.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
}
