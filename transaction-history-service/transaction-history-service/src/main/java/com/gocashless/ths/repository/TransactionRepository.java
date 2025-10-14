package com.gocashless.ths.repository;

import com.gocashless.ths.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

import com.gocashless.ths.model.TransactionStatus;
import com.gocashless.ths.model.TransactionType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserIdOrderByTransactionTimeDesc(UUID userId);
    List<Transaction> findByConductorIdOrderByTransactionTimeDesc(UUID conductorId);
    List<Transaction> findByTransactionTimeBetweenOrderByTransactionTimeDesc(LocalDateTime startTime, LocalDateTime endTime);
    List<Transaction> findByUserIdAndTransactionTimeBetweenOrderByTransactionTimeDesc(UUID userId, LocalDateTime startTime, LocalDateTime endTime);

    // Dashboard Queries
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = 'COMPLETED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT new map(function('date_trunc', 'day', t.transactionTime) as date, count(t) as count, sum(t.amount) as amount) FROM Transaction t GROUP BY function('date_trunc', 'day', t.transactionTime) ORDER BY function('date_trunc', 'day', t.transactionTime)")
    List<Map<String, Object>> getTransactionsOverTime();

    @Query("SELECT new map(t.status as status, count(t) as count) FROM Transaction t GROUP BY t.status")
    List<Map<String, Object>> getTransactionsByStatus();

    @Query("SELECT new map(t.transactionType as type, count(t) as count) FROM Transaction t GROUP BY t.transactionType")
    List<Map<String, Object>> getTransactionsByType();

    @Query("SELECT new map(t.routeId as routeId, sum(t.amount) as totalAmount) FROM Transaction t WHERE t.status = 'COMPLETED' GROUP BY t.routeId ORDER BY totalAmount DESC")
    List<Map<String, Object>> getTopRoutes();

    @Query("SELECT new map(t.conductorId as conductorId, sum(t.amount) as totalAmount) FROM Transaction t WHERE t.status = 'COMPLETED' GROUP BY t.conductorId ORDER BY totalAmount DESC")
    List<Map<String, Object>> getTopConductors();
}