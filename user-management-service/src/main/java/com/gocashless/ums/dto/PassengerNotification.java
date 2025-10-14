package com.gocashless.ums.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerNotification {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate registrationDate;
}
