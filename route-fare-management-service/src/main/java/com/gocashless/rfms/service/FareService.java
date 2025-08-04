package com.gocashless.rfms.service;

import com.gocashless.rfms.model.Fare;
import com.gocashless.rfms.model.Route;
import com.gocashless.rfms.model.BusStop;
import com.gocashless.rfms.repository.FareRepository;
import com.gocashless.rfms.repository.RouteRepository;
import com.gocashless.rfms.repository.BusStopRepository;
import com.gocashless.rfms.dto.FareRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class FareService {

    private final FareRepository fareRepository;
    private final RouteRepository routeRepository;
    private final BusStopRepository busStopRepository;

    @Autowired
    public FareService(FareRepository fareRepository, RouteRepository routeRepository, BusStopRepository busStopRepository) {
        this.fareRepository = fareRepository;
        this.routeRepository = routeRepository;
        this.busStopRepository = busStopRepository;
    }

    public Fare createFare(FareRequest request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + request.getRouteId()));
        BusStop originStop = busStopRepository.findById(request.getOriginStopId())
                .orElseThrow(() -> new IllegalArgumentException("Origin Stop not found with ID: " + request.getOriginStopId()));
        BusStop destinationStop = busStopRepository.findById(request.getDestinationStopId())
                .orElseThrow(() -> new IllegalArgumentException("Destination Stop not found with ID: " + request.getDestinationStopId()));

        Fare fare = new Fare();
        fare.setRoute(route);
        fare.setOriginStop(originStop);
        fare.setDestinationStop(destinationStop);
        fare.setAmount(request.getAmount());
        fare.setCurrency(request.getCurrency());
        fare.setValidFrom(request.getValidFrom() != null ? request.getValidFrom() : LocalDateTime.now());
        fare.setValidTo(request.getValidTo());

        return fareRepository.save(fare);
    }

    public Optional<Fare> getFareById(UUID id) {
        return fareRepository.findById(id);
    }

    public Optional<Fare> getFareForJourney(UUID routeId, UUID originStopId, UUID destinationStopId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + routeId));
        BusStop originStop = busStopRepository.findById(originStopId)
                .orElseThrow(() -> new IllegalArgumentException("Origin Stop not found with ID: " + originStopId));
        BusStop destinationStop = busStopRepository.findById(destinationStopId)
                .orElseThrow(() -> new IllegalArgumentException("Destination Stop not found with ID: " + destinationStopId));

        // This method finds the most recently valid fare
        return fareRepository.findFirstByRouteAndOriginStopAndDestinationStopOrderByValidFromDesc(
                route, originStop, destinationStop
        );
    }

    // Other update and delete methods
}
