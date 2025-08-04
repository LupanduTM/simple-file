package com.gocashless.qrgs.controller;

import com.gocashless.qrgs.model.QrGenerateRequest;
import com.gocashless.qrgs.model.QrGenerateResponse;
import com.gocashless.qrgs.service.QrCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST Controller for QR Code Generation Service.
 * Exposes endpoints for generating payment QR codes.
 */
@RestController
@RequestMapping("/api/v1/qr")
public class QrCodeController {

    private static final Logger logger = LoggerFactory.getLogger(QrCodeController.class);

    private final QrCodeService qrCodeService;

    @Autowired
    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    /**
     * Endpoint to generate a payment QR code.
     * This would be called by the Conductor App.
     *
     * @param request The request containing details for QR code generation (e.g., conductor, route, stops).
     * @return ResponseEntity with the Base64 encoded QR image and transaction reference.
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateQrCode(@RequestBody QrGenerateRequest request) {
        logger.info("Received QR code generation request: {}", request);
        try {
            QrGenerateResponse response = qrCodeService.generatePaymentQrCode(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid QR generation request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error generating QR code: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate QR code: " + e.getMessage());
        }
    }
}