package com.gocashless.pps.service;

import com.gocashless.pps.airtel.AirtelService;
import com.gocashless.pps.dto.AirtelCallback;
import com.gocashless.pps.dto.PaymentRequest;
import com.gocashless.pps.dto.PaymentResponse;
import com.gocashless.pps.model.Transaction;
import com.gocashless.pps.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TransactionRepository transactionRepository;
    private final AirtelService airtelService;

    public Mono<PaymentResponse> initiatePayment(PaymentRequest paymentRequest) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(paymentRequest.getTransactionId());
        transaction.setMsisdn(paymentRequest.getMsisdn());
        transaction.setAmount(paymentRequest.getAmount());
        transaction.setCountry(paymentRequest.getCountry());
        transaction.setCurrency(paymentRequest.getCurrency());
        transaction.setStatus("PENDING");
        transactionRepository.save(transaction);

        return airtelService.initiatePayment(paymentRequest)
                .then(Mono.fromCallable(() -> {
                    PaymentResponse response = new PaymentResponse();
                    response.setTransactionId(transaction.getTransactionId());
                    response.setStatus(transaction.getStatus());
                    response.setMessage("Payment initiation request sent to Airtel.");
                    return response;
                }))
                .doOnError(error -> {
                    transaction.setStatus("FAILED");
                    transaction.setResponseMessage(error.getMessage());
                    transactionRepository.save(transaction);
                });
    }

    public void handleCallback(AirtelCallback callback, String signature) {
        // In a real application, you would verify the signature from the callback
        // to ensure it's from a trusted source.
        if (!verifySignature(signature)) {
            throw new SecurityException("Invalid callback signature");
        }

        Transaction transaction = transactionRepository.findByTransactionId(callback.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(callback.getStatus());
        transactionRepository.save(transaction);

        // Here you would typically send a notification to the notification-service
    }

    private boolean verifySignature(String signature) {
        // Mock implementation of signature verification
        return true;
    }
}
