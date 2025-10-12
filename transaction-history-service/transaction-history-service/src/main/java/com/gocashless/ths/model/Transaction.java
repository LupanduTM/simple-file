package com.gocashless.ths.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId; // ID of the passenger or conductor involved

    private UUID conductorId; // ID of the conductor for fare payments (optional)

    @Column(nullable = false)
    private UUID routeId; // ID of the route for fare payments (from RFMS)

    @Column(nullable = false)
    private UUID originStopId; // ID of the origin bus stop (from RFMS)

    @Column(nullable = false)
    private UUID destinationStopId; // ID of the destination bus stop (from RFMS)

    @Column(nullable = false, precision = 10, scale = 2) // Precision for currency
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency; // e.g., "ZMW"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType; // e.g., FARE_PAYMENT, TOP_UP, WITHDRAWAL

    @Column(nullable = false)
    private String paymentMethod; // e.g., MOBILE_MONEY, CARD, CASH

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status; // e.g., COMPLETED, PENDING, FAILED

    @Column(nullable = false)
    private LocalDateTime transactionTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


