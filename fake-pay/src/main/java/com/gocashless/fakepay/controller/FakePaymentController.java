package com.gocashless.fakepay.controller;

import com.gocashless.fakepay.dto.PaymentTransferRequest;
import com.gocashless.fakepay.dto.PaymentTransferResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class FakePaymentController {

    @PostMapping("/api/v1/payments/transfer")
    public ResponseEntity<PaymentTransferResponse> transfer(@RequestBody PaymentTransferRequest request) {
        System.out.println("Received payment transfer request: " + request);

        // Simulate processing time
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Simulate random success/failure
        double random = Math.random();
        String status;
        String message;
        if (random < 0.8) { // 80% success rate
            status = "SUCCESS";
            message = "Payment successful.";
        } else {
            status = "FAILED";
            message = "Payment failed. Insufficient funds.";
        }

        String transactionId = UUID.randomUUID().toString();
        PaymentTransferResponse response = new PaymentTransferResponse(transactionId, status, message);

        System.out.println("Returning payment transfer response: " + response);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}