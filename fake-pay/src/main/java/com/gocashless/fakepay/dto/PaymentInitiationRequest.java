package com.gocashless.fakepay.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentInitiationRequest {
    private UUID userId; // The passenger's ID
    private UUID conductorId;
    private UUID routeId;
    private UUID originStopId;
    private UUID destinationStopId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
}
