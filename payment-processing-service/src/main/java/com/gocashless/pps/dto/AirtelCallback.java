package com.gocashless.pps.dto;

import lombok.Data;

@Data
public class AirtelCallback {
    private String transactionId;
    private String status;
    // Add other fields from Airtel Money callback as per their documentation
}
