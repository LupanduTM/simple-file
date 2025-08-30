package com.gocashless.pps.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the response to the Passenger App after initiating a payment.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitiatePaymentResponse {
    private String transactionRef;
    private String paymentGatewayTransactionId; // Airtel's transaction ID, if available immediately
    private String status; // e.g., "PENDING", "SUCCESS", "FAILED"
    private String message;
}
