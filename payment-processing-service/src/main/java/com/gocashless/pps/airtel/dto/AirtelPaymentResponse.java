package com.gocashless.pps.airtel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirtelPaymentResponse {
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
        private String id;
        private String status;
    }

    @lombok.Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Status {
        private String code;
        private String message;
        @JsonProperty("result_code")
        private String resultCode; // Deprecated, but included
        @JsonProperty("response_code")
        private String responseCode;
        private Boolean success;
    }
}