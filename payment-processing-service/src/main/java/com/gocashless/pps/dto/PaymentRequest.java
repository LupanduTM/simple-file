package com.gocashless.pps.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequest {
    private String msisdn;
    private BigDecimal amount;
    private String country;
    private String currency;
    private String transactionId;
}
