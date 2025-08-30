package com.gocashless.pps.airtel.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirtelDisbursementResponse {
    private Data data;
    private Status status;

    @lombok.Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Data {
        private Transaction transaction;
    }

    @lombok.Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Transaction {
        @JsonProperty("reference_id")
        private String referenceId;
        @JsonProperty("airtel_money_id")
        private String airtelMoneyId;
        private String id;
        private String status;
        private String message;
    }

    @lombok.Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Status {
        @JsonProperty("response_code")
        private String responseCode;
        private String code;
        private Boolean success;
        private String message;
    }
}
