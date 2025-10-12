package com.gocashless.ths.dto;

import com.gocashless.ths.model.TransactionStatus;
import com.gocashless.ths.model.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionRequest {
    private UUID userId;
    private UUID conductorId;
    private UUID routeId;
    private UUID originStopId;
    private UUID destinationStopId;
    private BigDecimal amount;
    private String currency;
    private TransactionType transactionType;
    private String paymentMethod;
    private TransactionStatus status;
    private LocalDateTime transactionTime;
}
