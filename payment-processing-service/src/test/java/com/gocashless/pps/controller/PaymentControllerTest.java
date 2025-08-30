package com.gocashless.pps.controller;

import com.gocashless.pps.dto.AirtelCallback;
import com.gocashless.pps.dto.PaymentRequest;
import com.gocashless.pps.dto.PaymentResponse;
import com.gocashless.pps.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@WebFluxTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private PaymentService paymentService;

    @Test
    void initiatePayment() {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setMsisdn("1234567890");
        paymentRequest.setAmount(new BigDecimal("10.00"));

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setStatus("PENDING");

        when(paymentService.initiatePayment(any(PaymentRequest.class))).thenReturn(Mono.just(paymentResponse));

        webTestClient.post().uri("/api/v1/payments/initiate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(paymentRequest)
                .exchange()
                .expectStatus().isOk()
                .expectBody(PaymentResponse.class)
                .isEqualTo(paymentResponse);
    }

    @Test
    void handleCallback() {
        AirtelCallback callback = new AirtelCallback();
        callback.setTransactionId("test-tx-id");
        callback.setStatus("SUCCESS");

        doNothing().when(paymentService).handleCallback(any(AirtelCallback.class), any(String.class));

        webTestClient.post().uri("/api/v1/payments/callback")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-Signature", "test-signature")
                .bodyValue(callback)
                .exchange()
                .expectStatus().isOk();
    }
}
