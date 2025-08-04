package com.gocashless.rfms.service;

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

    public List<BusStop> getAllBusStops() {
        return busStopRepository.findAll();
    }

    public Optional<BusStop> getBusStopById(UUID id) {
        return busStopRepository.findById(id);
    }

    public List<BusStop> getBusStopsByRoute(UUID routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + routeId));
        return busStopRepository.findByRouteOrderByOrderInRouteAsc(route);
    }

    // Other update and delete methods
}