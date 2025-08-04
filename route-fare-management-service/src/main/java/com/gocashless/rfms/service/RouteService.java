package com.gocashless.rfms.service;

import com.gocashless.rfms.model.Route;
import com.gocashless.rfms.repository.RouteRepository;
import com.gocashless.rfms.dto.RouteRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    @Autowired
    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Route createRoute(RouteRequest request) {
        if (routeRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Route with this name already exists.");
        }
        Route route = new Route();
        route.setName(request.getName());
        route.setDescription(request.getDescription());
        route.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Optional<Route> getRouteById(UUID id) {
        return routeRepository.findById(id);
    }

    public Route updateRoute(UUID id, RouteRequest request) {
        return routeRepository.findById(id).map(route -> {
            route.setName(request.getName());
            route.setDescription(request.getDescription());
            route.setIsActive(request.getIsActive());
            return routeRepository.save(route);
        }).orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + id));
    }

    public void deleteRoute(UUID id) {
        routeRepository.deleteById(id);
    }
}