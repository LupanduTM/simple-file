package com.gocashless.pps.controller;

import com.gocashless.pps.dto.AirtelCallback;
import com.gocashless.pps.dto.PaymentRequest;
import com.gocashless.pps.dto.PaymentResponse;
import com.gocashless.pps.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public Mono<ResponseEntity<PaymentResponse>> initiatePayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.initiatePayment(paymentRequest)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/callback")
    public ResponseEntity<Void> handleCallback(@RequestBody AirtelCallback callback,
                                                 @RequestHeader("X-Signature") String signature) {
        paymentService.handleCallback(callback, signature);
        return ResponseEntity.ok().build();
    }
}
