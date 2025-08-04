package com.gocashless.rfms.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class FareRequest {
    private UUID routeId;
    private UUID originStopId;
    private UUID destinationStopId;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
}