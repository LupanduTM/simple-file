package com.gocashless.pps.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AirtelPaymentRequest {
    private Subscriber subscriber;
    private Transaction transaction;
    private String reference;

    @Data
    @AllArgsConstructor
    public static class Subscriber {
        private String country;
        private String currency;
        private String msisdn;
    }

    @Data
    @AllArgsConstructor
    public static class Transaction {
        private BigDecimal amount;
        private String country;
        private String currency;
        private String id;
    }
}
