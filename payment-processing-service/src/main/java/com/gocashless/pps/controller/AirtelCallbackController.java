package com.gocashless.pps.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.gocashless.pps.service.PaymentProcessingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller to handle incoming webhook callbacks from Airtel Mobile Money.
 * This endpoint should be configured in your Airtel developer portal as a callback URL.
 */
@RestController
@RequestMapping("/airtel/callback") // Specific path for Airtel callbacks
public class AirtelCallbackController {

    private static final Logger logger = LoggerFactory.getLogger(AirtelCallbackController.class);

    private final PaymentProcessingService paymentProcessingService;

    @Autowired
    public AirtelCallbackController(PaymentProcessingService paymentProcessingService) {
        this.paymentProcessingService = paymentProcessingService;
    }

    /**
     * Endpoint to receive payment status updates from Airtel Mobile Money.
     * Airtel will send a POST request to this URL when a payment status changes.
     *
     * @param airtelCallback The raw JSON payload from Airtel.
     * @return ResponseEntity acknowledging receipt of the callback.
     */
    @PostMapping("/collection")
    public ResponseEntity<JsonNode> handleCollectionCallback(@RequestBody JsonNode airtelCallback) {
        logger.info("Received Airtel Collection Callback.");
        JsonNode response = paymentProcessingService.handleAirtelCollectionCallback(airtelCallback);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Add other callback endpoints if Airtel has separate ones for disbursements, etc.
    // @PostMapping("/disbursement")
    // public ResponseEntity<JsonNode> handleDisbursementCallback(@RequestBody JsonNode airtelCallback) { ... }
}