package com.gocashless.rfms.repository;

import com.gocashless.rfms.model.Fare;
import com.gocashless.rfms.model.Route;
import com.gocashless.rfms.model.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface FareRepository extends JpaRepository<Fare, UUID> {
    // Find fare for a specific route, origin, and destination valid now
    Optional<Fare> findByRouteAndOriginStopAndDestinationStopAndValidFromBeforeAndValidToAfterOrValidToIsNull(
            Route route, BusStop originStop, BusStop destinationStop, LocalDateTime now1, LocalDateTime now2);

    // Find current fare for a specific route, origin, and destination (simplified)
    Optional<Fare> findFirstByRouteAndOriginStopAndDestinationStopOrderByValidFromDesc(
            Route route, BusStop originStop, BusStop destinationStop);
}
