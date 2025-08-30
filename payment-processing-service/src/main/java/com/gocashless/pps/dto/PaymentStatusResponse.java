package com.gocashless.pps.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the response for a payment status query.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {
    private String transactionRef;
    private String status; // e.g., "PENDING", "SUCCESS", "FAILED", "UNKNOWN"
    private String message;
}