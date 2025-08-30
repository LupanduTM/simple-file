package com.gocashless.pps.airtel.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirtelPaymentRequest {
    private String reference;
    private Subscriber subscriber;
    private Transaction transaction;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Subscriber {
        private String country;
        private String currency; // Optional as per 1.txt, but included for completeness
        private String msisdn;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Transaction {
        private BigDecimal amount;
        private String country; // Optional as per 1.txt, but included for completeness
        private String currency; // Optional as per 1.txt, but included for completeness
        private String id; // Partner unique transaction id
    }
}
