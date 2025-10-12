package com.gocashless.ths.service;

import com.gocashless.ths.client.RfmsServiceClient;
import com.gocashless.ths.client.UmsServiceClient;
import com.gocashless.ths.dto.BusStopResponse;
import com.gocashless.ths.dto.RouteResponse;
import com.gocashless.ths.dto.UserResponse;
import com.gocashless.ths.model.Transaction;
import com.gocashless.ths.repository.TransactionRepository;
import com.gocashless.ths.dto.TransactionRequest;
import com.gocashless.ths.dto.TransactionResponse;
import com.gocashless.ths.model.TransactionStatus; // Import TransactionStatus
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UmsServiceClient umsServiceClient;
    private final RfmsServiceClient rfmsServiceClient;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, UmsServiceClient umsServiceClient, RfmsServiceClient rfmsServiceClient) {
        this.transactionRepository = transactionRepository;
        this.umsServiceClient = umsServiceClient;
        this.rfmsServiceClient = rfmsServiceClient;
    }

    public Transaction createTransaction(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setConductorId(request.getConductorId());
        transaction.setRouteId(request.getRouteId());
        transaction.setOriginStopId(request.getOriginStopId());
        transaction.setDestinationStopId(request.getDestinationStopId());
        transaction.setAmount(request.getAmount());
        transaction.setCurrency(request.getCurrency());
        transaction.setTransactionType(request.getTransactionType());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setStatus(request.getStatus() != null ? request.getStatus() : TransactionStatus.COMPLETED); // Default to COMPLETED
        transaction.setTransactionTime(request.getTransactionTime() != null ? request.getTransactionTime() : LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public Optional<TransactionResponse> getTransactionById(UUID id) {
        return transactionRepository.findById(id).map(this::toTransactionResponse);
    }

    public List<TransactionResponse> getTransactionsByUserId(UUID userId) {
        return transactionRepository.findByUserIdOrderByTransactionTimeDesc(userId)
                .stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByConductorId(UUID conductorId) {
        return transactionRepository.findByConductorIdOrderByTransactionTimeDesc(conductorId)
                .stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<Transaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByTransactionTimeBetweenOrderByTransactionTimeDesc(startDate, endDate);
    }

    private TransactionResponse toTransactionResponse(Transaction transaction) {
        UserResponse user = umsServiceClient.getUserById(transaction.getUserId());
        UserResponse conductor = transaction.getConductorId() != null ? umsServiceClient.getUserById(transaction.getConductorId()) : null;
        RouteResponse route = rfmsServiceClient.getRouteById(transaction.getRouteId());
        BusStopResponse originStop = rfmsServiceClient.getBusStopById(transaction.getOriginStopId());
        BusStopResponse destinationStop = rfmsServiceClient.getBusStopById(transaction.getDestinationStopId());

        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setUserId(transaction.getUserId());
        response.setUserName(user != null ? user.getFirstName() + " " + user.getLastName() : "Unknown");
        response.setConductorId(transaction.getConductorId());
        response.setConductorName(conductor != null ? conductor.getFirstName() + " " + conductor.getLastName() : "N/A");
        response.setRouteId(transaction.getRouteId());
        response.setRouteName(route != null ? route.getName() : "Unknown");
        response.setOriginStopId(transaction.getOriginStopId());
        response.setOriginStopName(originStop != null ? originStop.getName() : "Unknown");
        response.setDestinationStopId(transaction.getDestinationStopId());
        response.setDestinationStopName(destinationStop != null ? destinationStop.getName() : "Unknown");
        response.setAmount(transaction.getAmount());
        response.setCurrency(transaction.getCurrency());
        response.setTransactionType(transaction.getTransactionType());
        response.setPaymentMethod(transaction.getPaymentMethod());
        response.setStatus(transaction.getStatus());
        response.setTransactionTime(transaction.getTransactionTime());
        response.setCreatedAt(transaction.getCreatedAt());
        response.setUpdatedAt(transaction.getUpdatedAt());

        return response;
    }
}
