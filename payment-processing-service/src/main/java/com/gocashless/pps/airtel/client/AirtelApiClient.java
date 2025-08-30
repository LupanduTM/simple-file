package com.gocashless.pps.airtel.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gocashless.pps.config.AirtelApiConfig;
import com.gocashless.pps.airtel.dto.*; // Import all DTOs for Airtel API
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Client for making authenticated calls to the Airtel Mobile Money API.
 * Handles token generation, Collections (Request to Pay), and Disbursements.
 */
@Component
public class AirtelApiClient {

    private static final Logger logger = LoggerFactory.getLogger(AirtelApiClient.class);
    private final AirtelApiConfig airtelApiConfig;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    // Cache for access token to avoid re-generating for every request
    private final ConcurrentHashMap<String, String> accessTokenCache = new ConcurrentHashMap<>();
    private long tokenExpiryTime = 0; // Epoch milliseconds

    @Autowired
    public AirtelApiClient(AirtelApiConfig airtelApiConfig, WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.airtelApiConfig = airtelApiConfig;
        this.objectMapper = objectMapper;
        this.webClient = webClientBuilder.baseUrl(airtelApiConfig.getBaseUrl()).build();
    }

    /**
     * Generates an OAuth2 bearer token from Airtel Money API.
     * Caches the token and re-generates only when expired.
     *
     * @return The access token string.
     * @throws RuntimeException if token generation fails.
     */
    public String getAccessToken() {
        if (accessTokenCache.containsKey("airtel_token") && System.currentTimeMillis() < tokenExpiryTime) {
            return accessTokenCache.get("airtel_token");
        }

        logger.info("Generating new Airtel API access token...");
        String url = "/auth/oauth2/token";

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("client_id", airtelApiConfig.getClientId());
        payload.put("client_secret", airtelApiConfig.getClientSecret());
        payload.put("grant_type", "client_credentials");

        try {
            AirtelTokenResponse response = webClient.post()
                    .uri(url)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .body(BodyInserters.fromValue(payload.toString()))
                    .retrieve()
                    .bodyToMono(AirtelTokenResponse.class)
                    .block(); // Blocking call for simplicity, consider reactive in a full WebFlux app

            if (response != null && response.getAccessToken() != null) {
                accessTokenCache.put("airtel_token", response.getAccessToken());
                // Set expiry time a bit before actual expiry for safety (e.g., 5 minutes before)
                tokenExpiryTime = System.currentTimeMillis() + (response.getExpiresIn() * 1000) - (5 * 60 * 1000);
                logger.info("Airtel API access token generated successfully. Expires in {} seconds.", response.getExpiresIn());
                return response.getAccessToken();
            } else {
                throw new RuntimeException("Failed to get access token: Response was null or missing token.");
            }
        } catch (Exception e) {
            logger.error("Error generating Airtel API access token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Airtel API access token", e);
        }
    }

    /**
     * Initiates a merchant payment request (Collections - USSD Push) to a subscriber.
     * Corresponds to POST /merchant/v2/payments/
     *
     * @param request The payment request details.
     * @return AirtelPaymentResponse containing the API response.
     * @throws RuntimeException if the API call fails.
     */
    public AirtelPaymentResponse initiateCollectionPayment(AirtelPaymentRequest request) {
        String url = "/merchant/v2/payments/"; // Updated to v2 as per 1.txt

        try {
            String accessToken = getAccessToken();
            logger.info("Initiating Airtel Collection Payment to MSISDN: {}", request.getSubscriber().getMsisdn());

            // Note: x-signature and x-key are mentioned as required in 1.txt but not provided
            // in the original Python code. Implement message signing if Airtel requires it.
            // For now, they are omitted or can be added as empty strings if the API tolerates it.
            // Example: .header("x-signature", "")
            // Example: .header("x-key", "")

            return webClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Country", airtelApiConfig.getCountry())
                    .header("X-Currency", airtelApiConfig.getCurrency())
                    .body(BodyInserters.fromValue(objectMapper.writeValueAsString(request)))
                    .retrieve()
                    .bodyToMono(AirtelPaymentResponse.class)
                    .block();
        } catch (Exception e) {
            logger.error("Error initiating Airtel Collection Payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initiate Airtel Collection Payment", e);
        }
    }

    /**
     * Initiates a disbursement (transfer money) from the merchant account to a subscriber.
     * Corresponds to POST /standard/v3/disbursements
     *
     * @param request The disbursement request details.
     * @return AirtelDisbursementResponse containing the API response.
     * @throws RuntimeException if the API call fails.
     */
    public AirtelDisbursementResponse initiateDisbursement(AirtelDisbursementRequest request) {
        String url = "/standard/v3/disbursements"; // Updated to v3 as per 1.txt

        try {
            String accessToken = getAccessToken();
            logger.info("Initiating Airtel Disbursement to MSISDN: {}", request.getPayee().getMsisdn());

            // Encrypt the PIN
            String encryptedPin = PinEncryptor.genPin(airtelApiConfig.getDisbursementPin());
            request.setPin(encryptedPin); // Set the encrypted PIN in the request DTO

            // Note: x-signature and x-key are optional for disbursements in 1.txt.

            return webClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Country", airtelApiConfig.getCountry())
                    .header("X-Currency", airtelApiConfig.getCurrency())
                    .body(BodyInserters.fromValue(objectMapper.writeValueAsString(request)))
                    .retrieve()
                    .bodyToMono(AirtelDisbursementResponse.class)
                    .block();
        } catch (Exception e) {
            logger.error("Error initiating Airtel Disbursement: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initiate Airtel Disbursement", e);
        }
    }

    /**
     * Verifies the status of a previously initiated collection transaction.
     * Corresponds to GET /standard/v1/payments/{transactionId}
     * Note: The provided 1.txt only shows a Payments API for USSD Push, and a Disbursement API.
     * The verify transaction endpoint in the original Python was `/standard/v1/payments/{txn}`.
     * This might be a generic payment status check.
     *
     * @param transactionId The transaction ID to verify.
     * @return JsonNode containing the transaction verification details.
     * @throws RuntimeException if the API call fails.
     */
    public JsonNode verifyCollectionTransaction(String transactionId) {
        String url = "/standard/v1/payments/" + transactionId; // Assuming this endpoint is correct for verification

        try {
            String accessToken = getAccessToken();
            logger.info("Verifying Airtel Collection Transaction ID: {}", transactionId);

            return webClient.get()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Country", airtelApiConfig.getCountry())
                    .header("X-Currency", airtelApiConfig.getCurrency())
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
        } catch (Exception e) {
            logger.error("Error verifying Airtel Collection Transaction: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to verify Airtel Collection Transaction", e);
        }
    }

    /**
     * Checks the balance of the Airtel Money account associated with the API credentials.
     * Corresponds to GET /standard/v1/users/balance
     *
     * @return JsonNode containing the account balance details.
     * @throws RuntimeException if the API call fails.
     */
    public JsonNode getAirtelBalance() {
        String url = "/standard/v1/users/balance";

        try {
            String accessToken = getAccessToken();
            logger.info("Fetching Airtel account balance.");

            return webClient.get()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Country", airtelApiConfig.getCountry())
                    .header("X-Currency", airtelApiConfig.getCurrency())
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
        } catch (Exception e) {
            logger.error("Error fetching Airtel account balance: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch Airtel account balance", e);
        }
    }
}