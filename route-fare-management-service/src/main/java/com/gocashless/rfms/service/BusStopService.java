package com.gocashless.rfms.service;

import com.gocashless.rfms.dto.BusStopResponse;
import com.gocashless.rfms.model.BusStop;
import com.gocashless.rfms.model.Route;
import com.gocashless.rfms.repository.BusStopRepository;
import com.gocashless.rfms.repository.RouteRepository;
import com.gocashless.rfms.dto.BusStopRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BusStopService {

    private final BusStopRepository busStopRepository;
    private final RouteRepository routeRepository;

    @Autowired
    public BusStopService(BusStopRepository busStopRepository, RouteRepository routeRepository) {
        this.busStopRepository = busStopRepository;
        this.routeRepository = routeRepository;
    }

    public BusStop createBusStop(BusStopRequest request) {
        BusStop busStop = new BusStop();
        busStop.setName(request.getName());
        busStop.setLatitude(request.getLatitude());
        busStop.setLongitude(request.getLongitude());

        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + request.getRouteId()));
            busStop.setRoute(route);
            busStop.setOrderInRoute(request.getOrderInRoute());
        }

        return busStopRepository.save(busStop);
    }

    public List<BusStopResponse> getAllBusStops() {
        return busStopRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<BusStopResponse> getBusStopById(UUID id) {
        return busStopRepository.findById(id)
                .map(this::convertToResponse);
    }

    public List<BusStopResponse> getBusStopsByRoute(UUID routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + routeId));
        return busStopRepository.findByRouteOrderByOrderInRouteAsc(route).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private BusStopResponse convertToResponse(BusStop busStop) {
        BusStopResponse response = new BusStopResponse();
        response.setId(busStop.getId());
        response.setName(busStop.getName());
        response.setLatitude(busStop.getLatitude());
        response.setLongitude(busStop.getLongitude());
        if (busStop.getRoute() != null) {
            response.setRouteId(busStop.getRoute().getId());
            response.setRouteName(busStop.getRoute().getName());
        }
        response.setOrderInRoute(busStop.getOrderInRoute());
        return response;
    }

    public void deleteBusStop(UUID id) {
        if (!busStopRepository.existsById(id)) {
            throw new IllegalArgumentException("BusStop not found with ID: " + id);
        }
        busStopRepository.deleteById(id);
    }

    public BusStopResponse updateBusStop(UUID id, BusStopRequest request) {
        BusStop busStop = busStopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("BusStop not found with ID: " + id));

        busStop.setName(request.getName());
        busStop.setLatitude(request.getLatitude());
        busStop.setLongitude(request.getLongitude());

        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + request.getRouteId()));
            busStop.setRoute(route);
            busStop.setOrderInRoute(request.getOrderInRoute());
        } else {
            busStop.setRoute(null);
            busStop.setOrderInRoute(null);
        }

        BusStop savedBusStop = busStopRepository.save(busStop);
        return convertToResponse(savedBusStop);
    }

    // Other update and delete methods
}