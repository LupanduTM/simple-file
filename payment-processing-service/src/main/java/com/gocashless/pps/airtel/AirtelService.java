package com.gocashless.pps.airtel;

import com.gocashless.pps.config.AirtelConfig;
import com.gocashless.pps.dto.AirtelAuthRequest;
import com.gocashless.pps.dto.AirtelPaymentRequest;
import com.gocashless.pps.dto.AirtelTokenResponse;
import com.gocashless.pps.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AirtelService {

    private final WebClient.Builder webClientBuilder;
    private final AirtelConfig airtelConfig;

    public Mono<String> getAuthToken() {
        WebClient webClient = webClientBuilder.baseUrl(airtelConfig.getBaseUrl()).build();
        AirtelAuthRequest authRequest = new AirtelAuthRequest(
                airtelConfig.getClientId(),
                airtelConfig.getClientSecret(),
                "client_credentials"
        );

        return webClient.post()
                .uri("/auth/oauth2/token")
                .bodyValue(authRequest)
                .retrieve()
                .bodyToMono(AirtelTokenResponse.class)
                .map(AirtelTokenResponse::getAccessToken);
    }

    public Mono<Void> initiatePayment(PaymentRequest paymentRequest) {
        return getAuthToken().flatMap(token -> {
            WebClient webClient = webClientBuilder.baseUrl(airtelConfig.getBaseUrl()).build();

            AirtelPaymentRequest.Subscriber subscriber = new AirtelPaymentRequest.Subscriber(
                    paymentRequest.getCountry(),
                    paymentRequest.getCurrency(),
                    paymentRequest.getMsisdn()
            );

            AirtelPaymentRequest.Transaction transaction = new AirtelPaymentRequest.Transaction(
                    paymentRequest.getAmount(),
                    paymentRequest.getCountry(),
                    paymentRequest.getCurrency(),
                    paymentRequest.getTransactionId()
            );

            AirtelPaymentRequest airtelRequest = new AirtelPaymentRequest(subscriber, transaction, "Gocashless Payment");

            return webClient.post()
                    .uri("/merchant/v1/payments/")
                    .header("Authorization", "Bearer " + token)
                    .header("X-Country", paymentRequest.getCountry())
                    .header("X-Currency", paymentRequest.getCurrency())
                    .bodyValue(airtelRequest)
                    .retrieve()
                    .voidBody();
        });
    }
}
