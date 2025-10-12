package com.gocashless.ths.repository;

import com.gocashless.ths.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserIdOrderByTransactionTimeDesc(UUID userId);
    List<Transaction> findByConductorIdOrderByTransactionTimeDesc(UUID conductorId);
    List<Transaction> findByTransactionTimeBetweenOrderByTransactionTimeDesc(LocalDateTime startTime, LocalDateTime endTime);
    List<Transaction> findByUserIdAndTransactionTimeBetweenOrderByTransactionTimeDesc(UUID userId, LocalDateTime startTime, LocalDateTime endTime);
    // You can add more specific query methods as needed, e.g., by status, by type
}