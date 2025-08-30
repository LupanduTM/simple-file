package com.gocashless.pps.airtel.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirtelDisbursementRequest {
    private Payee payee;
    private String reference;
    private String pin; // Encrypted PIN
    private Transaction transaction;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Payee {
        private String msisdn;
        @JsonProperty("wallet_type")
        private String walletType; // e.g., "SALARY" or "NORMAL"
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Transaction {
        private BigDecimal amount;
        private String id; // Payer unique transaction id
        private String type; // e.g., "B2C" or "B2B"
    }
}