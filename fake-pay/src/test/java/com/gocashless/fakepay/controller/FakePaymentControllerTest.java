
package com.gocashless.fakepay.controller;

import com.gocashless.fakepay.client.TransactionHistoryServiceClient;
import com.gocashless.fakepay.client.dto.TransactionRequest;
import com.gocashless.fakepay.dto.PaymentInitiationRequest;
import com.gocashless.fakepay.dto.PaymentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

public class FakePaymentControllerTest {

    @InjectMocks
    private FakePaymentController fakePaymentController;

    @Mock
    private TransactionHistoryServiceClient transactionHistoryServiceClient;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testInitiatePayment_Success() {
        // Given
        PaymentInitiationRequest request = new PaymentInitiationRequest();
        doNothing().when(transactionHistoryServiceClient).createTransaction(any(TransactionRequest.class));

        // When
        ResponseEntity<PaymentResponse> response = fakePaymentController.initiatePayment(request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testInitiatePayment_TransactionHistoryServiceFails() {
        // Given
        PaymentInitiationRequest request = new PaymentInitiationRequest();
        doThrow(new RuntimeException("Service unavailable")).when(transactionHistoryServiceClient).createTransaction(any(TransactionRequest.class));

        // When
        ResponseEntity<PaymentResponse> response = fakePaymentController.initiatePayment(request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Payment successful, but failed to record transaction history.", response.getBody().getMessage());
    }
}
