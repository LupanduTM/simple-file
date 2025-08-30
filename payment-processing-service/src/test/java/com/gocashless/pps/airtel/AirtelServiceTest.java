package com.gocashless.pps.airtel;

import com.gocashless.pps.config.AirtelConfig;
import com.gocashless.pps.dto.PaymentRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AirtelServiceTest {

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private WebClient.RequestBodySpec requestBodySpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @Mock
    private AirtelConfig airtelConfig;

    @InjectMocks
    private AirtelService airtelService;

    @BeforeEach
    void setUp() {
        when(webClientBuilder.baseUrl(any(String.class))).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);
    }

    @Test
    void getAuthToken() {
        when(airtelConfig.getClientId()).thenReturn("test-client-id");

        Mono<String> authTokenMono = airtelService.getAuthToken();

        StepVerifier.create(authTokenMono)
                .expectNext("mock-auth-token")
                .verifyComplete();
    }

    @Test
    void initiatePayment() {
        when(airtelConfig.getBaseUrl()).thenReturn("http://localhost");
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(any(String.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(String.class), any(String.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.voidBody()).thenReturn(Mono.empty());

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setMsisdn("1234567890");
        paymentRequest.setAmount(new BigDecimal("10.00"));

        Mono<Void> result = airtelService.initiatePayment(paymentRequest);

        StepVerifier.create(result)
                .verifyComplete();
    }
}
