
package com.gocashless.ths.service;

import com.gocashless.ths.client.RfmsServiceClient;
import com.gocashless.ths.client.UmsServiceClient;
import com.gocashless.ths.dto.*;
import com.gocashless.ths.model.Transaction;
import com.gocashless.ths.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class TransactionServiceTest {

    @InjectMocks
    private TransactionService transactionService;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UmsServiceClient umsServiceClient;

    @Mock
    private RfmsServiceClient rfmsServiceClient;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateTransaction_Success() {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setUserId(UUID.randomUUID());

        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        Transaction transaction = transactionService.createTransaction(request);

        // Then
        assertNotNull(transaction);
        assertEquals(request.getUserId(), transaction.getUserId());
    }

    @Test
    public void testGetTransactionById_Success() {
        // Given
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = new Transaction();
        transaction.setId(transactionId);
        transaction.setUserId(UUID.randomUUID());
        transaction.setRouteId(UUID.randomUUID());
        transaction.setOriginStopId(UUID.randomUUID());
        transaction.setDestinationStopId(UUID.randomUUID());

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transaction));

        // When
        Optional<TransactionResponse> response = transactionService.getTransactionById(transactionId);

        // Then
        assertTrue(response.isPresent());
        assertEquals(transactionId, response.get().getId());
    }

    @Test
    public void testGetTransactionsByUserId_Success() {
        // Given
        UUID userId = UUID.randomUUID();
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setRouteId(UUID.randomUUID());
        transaction.setOriginStopId(UUID.randomUUID());
        transaction.setDestinationStopId(UUID.randomUUID());

        when(transactionRepository.findByUserIdOrderByTransactionTimeDesc(userId)).thenReturn(Collections.singletonList(transaction));

        // When
        List<TransactionResponse> responses = transactionService.getTransactionsByUserId(userId);

        // Then
        assertFalse(responses.isEmpty());
        assertEquals(userId, responses.get(0).getUserId());
    }

    @Test
    public void testGetTransactionsByConductorId_Success() {
        // Given
        UUID conductorId = UUID.randomUUID();
        Transaction transaction = new Transaction();
        transaction.setConductorId(conductorId);
        transaction.setUserId(UUID.randomUUID());
        transaction.setRouteId(UUID.randomUUID());
        transaction.setOriginStopId(UUID.randomUUID());
        transaction.setDestinationStopId(UUID.randomUUID());

        when(transactionRepository.findByConductorIdOrderByTransactionTimeDesc(conductorId)).thenReturn(Collections.singletonList(transaction));

        // When
        List<TransactionResponse> responses = transactionService.getTransactionsByConductorId(conductorId);

        // Then
        assertFalse(responses.isEmpty());
        assertEquals(conductorId, responses.get(0).getConductorId());
    }

    @Test
    public void testGetTransactionsByDateRange_Success() {
        // Given
        LocalDateTime startDate = LocalDateTime.now().minusDays(1);
        LocalDateTime endDate = LocalDateTime.now();
        Transaction transaction = new Transaction();

        when(transactionRepository.findByTransactionTimeBetweenOrderByTransactionTimeDesc(startDate, endDate)).thenReturn(Collections.singletonList(transaction));

        // When
        List<Transaction> transactions = transactionService.getTransactionsByDateRange(startDate, endDate);

        // Then
        assertFalse(transactions.isEmpty());
    }
}
