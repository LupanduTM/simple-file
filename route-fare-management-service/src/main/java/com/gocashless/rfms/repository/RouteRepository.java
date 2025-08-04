package com.gocashless.rfms.repository;

import com.gocashless.rfms.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface RouteRepository extends JpaRepository<Route, UUID> {
    Optional<Route> findByName(String name);
    boolean existsByName(String name);
}