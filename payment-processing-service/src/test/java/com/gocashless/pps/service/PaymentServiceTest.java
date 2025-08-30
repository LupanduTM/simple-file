package com.gocashless.pps.service;

import com.gocashless.pps.airtel.AirtelService;
import com.gocashless.pps.dto.AirtelCallback;
import com.gocashless.pps.dto.PaymentRequest;
import com.gocashless.pps.dto.PaymentResponse;
import com.gocashless.pps.model.Transaction;
import com.gocashless.pps.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private AirtelService airtelService;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void initiatePayment() {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setMsisdn("1234567890");
        paymentRequest.setAmount(new BigDecimal("10.00"));

        when(airtelService.initiatePayment(any(PaymentRequest.class))).thenReturn(Mono.empty());

        Mono<PaymentResponse> paymentResponseMono = paymentService.initiatePayment(paymentRequest);

        StepVerifier.create(paymentResponseMono)
                .expectNextMatches(response -> response.getStatus().equals("PENDING"))
                .verifyComplete();
    }

    @Test
    void handleCallback() {
        AirtelCallback callback = new AirtelCallback();
        callback.setTransactionId("test-tx-id");
        callback.setStatus("SUCCESS");

        Transaction transaction = new Transaction();
        transaction.setTransactionId("test-tx-id");

        when(transactionRepository.findByTransactionId("test-tx-id")).thenReturn(Optional.of(transaction));

        paymentService.handleCallback(callback, "signature");

        assert transaction.getStatus().equals("SUCCESS");
    }
}
