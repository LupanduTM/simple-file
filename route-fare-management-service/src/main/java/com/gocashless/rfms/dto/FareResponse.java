package com.gocashless.rfms.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class FareResponse {
    private UUID id;
    private UUID routeId;
    private String routeName;
    private UUID originStopId;
    private String originStopName;
    private UUID destinationStopId;
    private String destinationStopName;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
}
