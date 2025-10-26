package com.gocashless.qrgs.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gocashless.qrgs.model.QrGenerateRequest;
import com.gocashless.qrgs.model.QrGenerateResponse;
import com.gocashless.qrgs.util.QrCodeGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class QrCodeServiceTest {

    @InjectMocks
    private QrCodeService qrCodeService;

    @Mock
    private QrCodeGenerator qrCodeGenerator;

    @Mock
    private EncryptionService encryptionService;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        qrCodeService = new QrCodeService(qrCodeGenerator, encryptionService, restTemplate, new ObjectMapper());
    }

    @Test
    public void testGeneratePaymentQrCode_Success() throws Exception {
        // Given
        QrGenerateRequest request = new QrGenerateRequest();
        request.setConductorId(UUID.randomUUID());
        request.setRouteId(UUID.randomUUID());
        request.setOriginStopId(UUID.randomUUID());
        request.setDestinationStopId(UUID.randomUUID());

        JsonNode fareResponse = new ObjectMapper().createObjectNode().put("amount", "10.0").put("currency", "USD");
        JsonNode userResponse = new ObjectMapper().createObjectNode().put("firstName", "John").put("lastName", "Doe").put("phoneNumber", "1234567890");
        JsonNode stopResponse = new ObjectMapper().createObjectNode().put("name", "Stop Name");

        when(restTemplate.getForObject(anyString(), any(Class.class))).thenReturn(fareResponse, userResponse, stopResponse, stopResponse);
        when(encryptionService.encryptPayload(any())).thenReturn("encrypted_payload");
        when(qrCodeGenerator.generateQrCodeImageBase64(anyString())).thenReturn("test_qr_code");

        // When
        QrGenerateResponse response = qrCodeService.generatePaymentQrCode(request);

        // Then
        assertNotNull(response);
        assertEquals("test_qr_code", response.getQrCodeImageBase64());
        assertNotNull(response.getTransactionRef());
        assertEquals("QR Code generated successfully.", response.getMessage());
    }

    @Test
    public void testGeneratePaymentQrCode_FareNotFound() {
        // Given
        QrGenerateRequest request = new QrGenerateRequest();
        request.setConductorId(UUID.randomUUID());
        request.setRouteId(UUID.randomUUID());
        request.setOriginStopId(UUID.randomUUID());
        request.setDestinationStopId(UUID.randomUUID());

        when(restTemplate.getForObject(anyString(), any(Class.class))).thenReturn(null);

        // Then
        assertThrows(IllegalArgumentException.class, () -> {
            // When
            qrCodeService.generatePaymentQrCode(request);
        });
    }

    @Test
    public void testGeneratePaymentQrCode_UserNotFound() {
        // Given
        QrGenerateRequest request = new QrGenerateRequest();
        request.setConductorId(UUID.randomUUID());
        request.setRouteId(UUID.randomUUID());
        request.setOriginStopId(UUID.randomUUID());
        request.setDestinationStopId(UUID.randomUUID());

        JsonNode fareResponse = new ObjectMapper().createObjectNode().put("amount", "10.0").put("currency", "USD");

        when(restTemplate.getForObject(anyString(), any(Class.class))).thenReturn(fareResponse, null);

        // Then
        assertThrows(IllegalArgumentException.class, () -> {
            // When
            qrCodeService.generatePaymentQrCode(request);
        });
    }
}