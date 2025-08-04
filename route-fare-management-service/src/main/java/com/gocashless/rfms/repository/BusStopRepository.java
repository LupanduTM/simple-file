package com.gocashless.rfms.repository;

import com.gocashless.rfms.model.BusStop;
import com.gocashless.rfms.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BusStopRepository extends JpaRepository<BusStop, UUID> {
    Optional<BusStop> findByName(String name);
    List<BusStop> findByRouteOrderByOrderInRouteAsc(Route route);
}