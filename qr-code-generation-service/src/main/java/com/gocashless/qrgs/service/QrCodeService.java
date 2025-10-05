package com.gocashless.qrgs.service;

import com.gocashless.qrgs.model.QrGenerateRequest;
import com.gocashless.qrgs.model.QrGenerateResponse;
import com.gocashless.qrgs.util.QrCodeGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate; // For inter-service communication
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Service
public class QrCodeService {

    private static final Logger logger = LoggerFactory.getLogger(QrCodeService.class);

    private final QrCodeGenerator qrCodeGenerator;
    private final EncryptionService encryptionService;
    private final RestTemplate restTemplate; // For calling RFMS (Route & Fare Management Service)
    private final ObjectMapper objectMapper; // For building JSON payload

    @Autowired
    public QrCodeService(QrCodeGenerator qrCodeGenerator, EncryptionService encryptionService, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.qrCodeGenerator = qrCodeGenerator;
        this.encryptionService = encryptionService;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Generates a QR code containing encrypted payment details.
     *
     * @param request The request containing conductor, route, and stop IDs.
     * @return QrGenerateResponse containing the Base64 encoded QR image and transaction reference.
     * @throws Exception If any error occurs during fare lookup, encryption, or QR generation.
     */
    public QrGenerateResponse generatePaymentQrCode(QrGenerateRequest request) throws Exception {

        // --- REAL SCENARIO ---
        // 2. Query RFMS to get the fare amount
        // Using Eureka service name for lookup
        String rfmsUrl = "http://ROUTE-FARE-MANAGEMENT-SERVICE/api/v1/fares/lookup";
        // Build query parameters for RestTemplate
        String fareLookupUrl = String.format("%s?routeId=%s&originStopId=%s&destinationStopId=%s",
                rfmsUrl, request.getRouteId(), request.getOriginStopId(), request.getDestinationStopId());

        logger.info("Calling RFMS for fare lookup: {}", fareLookupUrl);
        JsonNode fareResponse = restTemplate.getForObject(fareLookupUrl, JsonNode.class);

        if (fareResponse == null || fareResponse.get("amount") == null) {
            logger.error("Fare not found for the given route and stops. RFMS Response: {}", fareResponse);
            throw new IllegalArgumentException("Fare information could not be retrieved for the specified journey.");
        }

        BigDecimal fareAmount = new BigDecimal(fareResponse.get("amount").asText());
        String currency = fareResponse.get("currency").asText();
        // --- END OF REAL SCENARIO ---


        // 3. Generate a unique transaction reference
        String transactionRef = UUID.randomUUID().toString();

        // 4. Construct the QR Payload (as a simple JSON object)
        ObjectNode qrPayload = objectMapper.createObjectNode();
        qrPayload.put("conductorId", request.getConductorId().toString());
        qrPayload.put("fareAmount", fareAmount);
        qrPayload.put("currency", currency);
        qrPayload.put("transactionRef", transactionRef);
        qrPayload.put("timestamp", Instant.now().toEpochMilli());
        // In a real system, you'd add a digital signature here for integrity verification
       // qrPayload.put("signature", generateSignature(qrPayloadJsonString));

        // 5. Encrypt the payload
        String encryptedPayload = encryptionService.encryptPayload(qrPayload);
        logger.info("Encrypted QR Payload: {}", encryptedPayload);

        // 6. Generate the QR code image from the encrypted payload
        String qrCodeImageBase64 = qrCodeGenerator.generateQrCodeImageBase64(encryptedPayload);

        QrGenerateResponse response = new QrGenerateResponse();
        response.setQrCodeImageBase64(qrCodeImageBase64);
        response.setTransactionRef(transactionRef);
        response.setMessage("QR Code generated successfully.");
        return response;
    }
}
