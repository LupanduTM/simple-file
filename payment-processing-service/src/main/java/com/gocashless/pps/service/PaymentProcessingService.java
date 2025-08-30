package com.gocashless.pps.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gocashless.pps.airtel.client.AirtelApiClient;
import com.gocashless.pps.airtel.dto.AirtelPaymentRequest;
import com.gocashless.pps.airtel.dto.AirtelPaymentResponse;
import com.gocashless.pps.airtel.dto.AirtelDisbursementRequest;
import com.gocashless.pps.airtel.dto.AirtelDisbursementResponse;
import com.gocashless.pps.dto.InitiatePaymentRequest;
import com.gocashless.pps.dto.InitiatePaymentResponse;
import com.gocashless.pps.dto.PaymentStatusResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Service responsible for orchestrating payment processing.
 * It interacts with the Airtel API client and will eventually
 * communicate with the Transaction History Service (THS) and
 * Notification Service (NOS).
 */
@Service
public class PaymentProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentProcessingService.class);

    private final AirtelApiClient airtelApiClient;
    private final ObjectMapper objectMapper; // To deserialize QR payload

    // TODO: Inject proxies for THS and NOS here
    // private final TransactionHistoryProxy transactionHistoryProxy;
    // private final NotificationServiceProxy notificationServiceProxy;

    @Autowired
    public PaymentProcessingService(AirtelApiClient airtelApiClient, ObjectMapper objectMapper) {
        this.airtelApiClient = airtelApiClient;
        this.objectMapper = objectMapper;
        // TODO: Initialize proxies
        // this.transactionHistoryProxy = transactionHistoryProxy;
        // this.notificationServiceProxy = notificationServiceProxy;
    }

    /**
     * Initiates a payment request (Collection) from a passenger.
     * This method receives the decrypted QR payload.
     *
     * @param request The payment initiation request from the Passenger App.
     * @return InitiatePaymentResponse indicating the status of the request.
     */
    public InitiatePaymentResponse initiatePassengerPayment(InitiatePaymentRequest request) {
        logger.info("Initiating passenger payment for transactionRef: {}", request.getTransactionRef());

        try {
            // 1. Prepare Airtel Payment Request DTO
            AirtelPaymentRequest airtelRequest = new AirtelPaymentRequest();
            airtelRequest.setReference("Gocashless Payment for " + request.getTransactionRef());

            AirtelPaymentRequest.Subscriber subscriber = new AirtelPaymentRequest.Subscriber();
            subscriber.setMsisdn(request.getPassengerPhoneNumber().startsWith("0") ?
                    request.getPassengerPhoneNumber().substring(1) : request.getPassengerPhoneNumber()); // Remove leading 0
            subscriber.setCountry("ZM"); // From config
            subscriber.setCurrency("ZMW"); // From config
            airtelRequest.setSubscriber(subscriber);

            AirtelPaymentRequest.Transaction transaction = new AirtelPaymentRequest.Transaction();
            transaction.setAmount(request.getAmount());
            transaction.setCountry("ZM"); // From config
            transaction.setCurrency("ZMW"); // From config
            transaction.setId(request.getTransactionRef()); // Use the unique ID from QR code
            airtelRequest.setTransaction(transaction);

            // 2. Call Airtel Collections API
            AirtelPaymentResponse airtelResponse = airtelApiClient.initiateCollectionPayment(airtelRequest);
            logger.info("Airtel Collection API response: {}", airtelResponse);

            // 3. Record initial transaction status in THS (PENDING, or based on immediate Airtel response)
            // TODO: transactionHistoryProxy.saveTransaction(request.getPassengerId(), request.getConductorId(),
            //                                            request.getAmount(), request.getCurrency(),
            //                                            request.getTransactionRef(), airtelResponse.getData().getTransaction().getId(),
            //                                            "PENDING_AIRTEL_PIN_CONFIRMATION");

            // 4. Return response to Passenger App
            if (airtelResponse != null && airtelResponse.getStatus().getSuccess()) {
                return new InitiatePaymentResponse(
                        request.getTransactionRef(),
                        airtelResponse.getData().getTransaction().getId(),
                        "PENDING", // Airtel sends USSD push, payment is pending user PIN
                        "Payment request sent. Please confirm on your mobile money app."
                );
            } else {
                String errorMessage = airtelResponse != null ? airtelResponse.getStatus().getMessage() : "Unknown error from Airtel.";
                return new InitiatePaymentResponse(
                        request.getTransactionRef(),
                        null,
                        "FAILED",
                        "Payment initiation failed: " + errorMessage
                );
            }

        } catch (Exception e) {
            logger.error("Error initiating passenger payment for transactionRef {}: {}", request.getTransactionRef(), e.getMessage(), e);
            // TODO: transactionHistoryProxy.saveFailedTransaction(...)
            return new InitiatePaymentResponse(
                    request.getTransactionRef(),
                    null,
                    "FAILED",
                    "An internal error occurred: " + e.getMessage()
            );
        }
    }

    /**
     * Handles the callback from Airtel Mobile Money API for Collections.
     * This is the endpoint Airtel will hit to notify about payment success/failure.
     *
     * @param airtelCallback The raw JSON payload from Airtel.
     * @return A response confirming receipt of the callback.
     */
    public JsonNode handleAirtelCollectionCallback(JsonNode airtelCallback) {
        logger.info("Received Airtel Collection Callback: {}", airtelCallback.toPrettyString());

        try {
            String transactionRef = airtelCallback.at("/data/transaction/id").asText(); // Partner's transaction ID
            String airtelMoneyId = airtelCallback.at("/data/transaction/airtel_money_id").asText(); // Airtel's ID (if available)
            String status = airtelCallback.at("/data/transaction/status").asText(); // e.g., "SUCCESS", "FAILED"
            String message = airtelCallback.at("/status/message").asText();

            // Map Airtel status to Gocashless internal status
            String gocashlessStatus;
            if ("SUCCESS".equalsIgnoreCase(status) || "TS".equalsIgnoreCase(status)) { // "TS" is Transaction Successful from 1.txt
                gocashlessStatus = "SUCCESS";
            } else if ("FAILED".equalsIgnoreCase(status)) {
                gocashlessStatus = "FAILED";
            } else {
                gocashlessStatus = "UNKNOWN";
            }

            logger.info("Processing Airtel callback for transactionRef: {}, Status: {}", transactionRef, gocashlessStatus);

            // 1. Update transaction status in THS
            // TODO: transactionHistoryProxy.updateTransactionStatus(transactionRef, gocashlessStatus, airtelMoneyId, airtelCallback);

            // 2. Notify relevant parties (Conductor, Passenger) via NOS
            // TODO: notificationServiceProxy.sendPaymentStatusNotification(transactionRef, gocashlessStatus, message);

            // Return a success response to Airtel to acknowledge receipt
            ObjectNode response = objectMapper.createObjectNode();
            response.put("status", "RECEIVED");
            response.put("message", "Callback processed successfully");
            return response;

        } catch (Exception e) {
            logger.error("Error processing Airtel Collection Callback: {}", e.getMessage(), e);
            // Log the error and return an appropriate response to Airtel
            ObjectNode errorResponse = objectMapper.createObjectNode();
            errorResponse.put("status", "ERROR");
            errorResponse.put("message", "Failed to process callback: " + e.getMessage());
            return errorResponse;
        }
    }

    /**
     * Initiates a disbursement (e.g., for refunds or conductor payouts).
     *
     * @param phoneNumber The recipient's phone number.
     * @param amount The amount to disburse.
     * @param transactionId A unique ID for this disbursement.
     * @param walletType The type of wallet (e.g., "NORMAL", "SALARY").
     * @param transactionType The type of transaction (e.g., "B2C", "B2B").
     * @return AirtelDisbursementResponse from the Airtel API.
     */
    public AirtelDisbursementResponse initiateDisbursement(
            String phoneNumber, BigDecimal amount, String transactionId,
            String walletType, String transactionType) {
        logger.info("Initiating disbursement for phone: {} with amount: {}", phoneNumber, amount);

        try {
            AirtelDisbursementRequest airtelRequest = new AirtelDisbursementRequest();
            airtelRequest.setReference("Gocashless Disbursement for " + transactionId);

            AirtelDisbursementRequest.Payee payee = new AirtelDisbursementRequest.Payee();
            payee.setMsisdn(phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber); // Remove leading 0
            payee.setWalletType(walletType);
            airtelRequest.setPayee(payee);

            AirtelDisbursementRequest.Transaction transaction = new AirtelDisbursementRequest.Transaction();
            transaction.setAmount(amount);
            transaction.setId(transactionId);
            transaction.setType(transactionType);
            airtelRequest.setTransaction(transaction);

            return airtelApiClient.initiateDisbursement(airtelRequest);
        } catch (Exception e) {
            logger.error("Error initiating disbursement for transaction {}: {}", transactionId, e.getMessage(), e);
            throw new RuntimeException("Failed to initiate disbursement", e);
        }
    }

    /**
     * Retrieves the status of a payment/transaction.
     * This could be used for polling or manual verification.
     *
     * @param transactionRef The internal transaction reference ID.
     * @return PaymentStatusResponse with the current status.
     */
    public PaymentStatusResponse getPaymentStatus(String transactionRef) {
        logger.info("Getting payment status for transactionRef: {}", transactionRef);
        // In a real system, this would query THS first, and only call Airtel if THS status is PENDING/UNKNOWN
        // For now, directly calling Airtel for demonstration.

        try {
            JsonNode airtelResponse = airtelApiClient.verifyCollectionTransaction(transactionRef);
            String status = airtelResponse.at("/data/transaction/status").asText();
            String message = airtelResponse.at("/status/message").asText();

            String gocashlessStatus;
            if ("SUCCESS".equalsIgnoreCase(status) || "TS".equalsIgnoreCase(status)) {
                gocashlessStatus = "SUCCESS";
            } else if ("FAILED".equalsIgnoreCase(status)) {
                gocashlessStatus = "FAILED";
            } else {
                gocashlessStatus = "PENDING"; // Default for other statuses
            }

            return new PaymentStatusResponse(transactionRef, gocashlessStatus, message);
        } catch (Exception e) {
            logger.error("Error getting payment status for transactionRef {}: {}", transactionRef, e.getMessage(), e);
            return new PaymentStatusResponse(transactionRef, "UNKNOWN", "Failed to retrieve status: " + e.getMessage());
        }
    }

    // Placeholder for other service proxies
    // public void setTransactionHistoryProxy(TransactionHistoryProxy transactionHistoryProxy) {
    //     this.transactionHistoryProxy = transactionHistoryProxy;
    // }
    // public void setNotificationServiceProxy(NotificationServiceProxy notificationServiceProxy) {
    //     this.notificationServiceProxy = notificationServiceProxy;
    // }
}
