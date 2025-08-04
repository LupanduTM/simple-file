package com.gocashless.rfms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fares")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fare {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_stop_id", nullable = false)
    private BusStop originStop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_stop_id", nullable = false)
    private BusStop destinationStop;

    @Column(nullable = false, precision = 10, scale = 2) // Precision for currency
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency; // e.g., "ZMW"

    private LocalDateTime validFrom;
    private LocalDateTime validTo; // Optional, for future fare changes

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