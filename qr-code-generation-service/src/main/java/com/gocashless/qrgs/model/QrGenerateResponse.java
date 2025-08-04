package com.gocashless.qrgs.model;

import lombok.Data;

@Data
public class QrGenerateResponse {
    private String qrCodeImageBase64; // Base64 encoded PNG image
    private String transactionRef;    // Unique transaction ID generated for this QR
    private String message;           // Optional message
}
