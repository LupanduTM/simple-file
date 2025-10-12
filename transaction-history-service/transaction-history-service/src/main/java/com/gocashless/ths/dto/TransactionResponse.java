package com.gocashless.ths.dto;

import com.gocashless.ths.model.TransactionStatus;
import com.gocashless.ths.model.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionResponse {
    private UUID id;
    private UUID userId;
    private String userName; // Enriched from UMS
    private UUID conductorId;
    private String conductorName; // Enriched from UMS
    private UUID routeId;
    private String routeName; // Enriched from RFMS
    private UUID originStopId;
    private String originStopName; // Enriched from RFMS
    private UUID destinationStopId;
    private String destinationStopName; // Enriched from RFMS
    private BigDecimal amount;
    private String currency;
    private TransactionType transactionType;
    private String paymentMethod;
    private TransactionStatus status;
    private LocalDateTime transactionTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
