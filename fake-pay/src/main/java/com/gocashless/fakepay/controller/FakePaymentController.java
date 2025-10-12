package com.gocashless.fakepay.controller;

import com.gocashless.fakepay.client.TransactionHistoryServiceClient;
import com.gocashless.fakepay.client.dto.TransactionRequest;
import com.gocashless.fakepay.client.dto.TransactionStatus;
import com.gocashless.fakepay.client.dto.TransactionType;
import com.gocashless.fakepay.dto.PaymentInitiationRequest;
import com.gocashless.fakepay.dto.PaymentResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class FakePaymentController {

    private final TransactionHistoryServiceClient transactionHistoryServiceClient;

    public FakePaymentController(TransactionHistoryServiceClient transactionHistoryServiceClient) {
        this.transactionHistoryServiceClient = transactionHistoryServiceClient;
    }

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiatePayment(@RequestBody PaymentInitiationRequest request) {
        System.out.println("Received payment initiation request: " + request);

        // Simulate processing time
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new ResponseEntity<>(new PaymentResponse(null, "ERROR", "Payment processing was interrupted."), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Simulate random success/failure
        double random = Math.random();
        boolean isSuccess = random < 0.9; // 90% success rate

        if (isSuccess) {
            System.out.println("Payment simulation SUCCESSFUL.");

            // Create the request for the transaction-history-service
            TransactionRequest historyRequest = new TransactionRequest();
            historyRequest.setUserId(request.getUserId());
            historyRequest.setConductorId(request.getConductorId());
            historyRequest.setRouteId(request.getRouteId());
            historyRequest.setOriginStopId(request.getOriginStopId());
            historyRequest.setDestinationStopId(request.getDestinationStopId());
            historyRequest.setAmount(request.getAmount());
            historyRequest.setCurrency(request.getCurrency());
            historyRequest.setPaymentMethod(request.getPaymentMethod());
            historyRequest.setTransactionType(TransactionType.FARE_PAYMENT);
            historyRequest.setStatus(TransactionStatus.COMPLETED);
            historyRequest.setTransactionTime(LocalDateTime.now());

            try {
                System.out.println("Sending transaction to history service: " + historyRequest);
                transactionHistoryServiceClient.createTransaction(historyRequest);
                System.out.println("Successfully sent transaction to history service.");

                String transactionId = UUID.randomUUID().toString();
                PaymentResponse response = new PaymentResponse(transactionId, "SUCCESS", "Payment completed successfully.");
                return new ResponseEntity<>(response, HttpStatus.OK);

            } catch (Exception e) {
                System.err.println("Error calling transaction-history-service: " + e.getMessage());
                // Even if saving history fails, the payment was 'successful' from the user's perspective.
                // In a real app, you'd have retry logic or a fallback.
                PaymentResponse response = new PaymentResponse(UUID.randomUUID().toString(), "SUCCESS", "Payment successful, but failed to record transaction history.");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }

        } else {
            System.out.println("Payment simulation FAILED.");
            PaymentResponse response = new PaymentResponse(null, "FAILED", "Payment failed. Insufficient funds.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }
}