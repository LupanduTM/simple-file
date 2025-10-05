package com.gocashless.rfms.service;

import com.gocashless.rfms.dto.FareRequest;
import com.gocashless.rfms.dto.FareResponse;
import com.gocashless.rfms.model.BusStop;
import com.gocashless.rfms.model.Fare;
import com.gocashless.rfms.model.Route;
import com.gocashless.rfms.repository.BusStopRepository;
import com.gocashless.rfms.repository.FareRepository;
import com.gocashless.rfms.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public FareResponse createFare(FareRequest request) {
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

        Fare savedFare = fareRepository.save(fare);
        return convertToResponse(savedFare);
    }

    public List<FareResponse> getAllFares() {
        return fareRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<FareResponse> getFareById(UUID id) {
        return fareRepository.findById(id)
                .map(this::convertToResponse);
    }

    public FareResponse updateFare(UUID id, FareRequest request) {
        Fare fare = fareRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fare not found with ID: " + id));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + request.getRouteId()));
        BusStop originStop = busStopRepository.findById(request.getOriginStopId())
                .orElseThrow(() -> new IllegalArgumentException("Origin Stop not found with ID: " + request.getOriginStopId()));
        BusStop destinationStop = busStopRepository.findById(request.getDestinationStopId())
                .orElseThrow(() -> new IllegalArgumentException("Destination Stop not found with ID: " + request.getDestinationStopId()));

        fare.setRoute(route);
        fare.setOriginStop(originStop);
        fare.setDestinationStop(destinationStop);
        fare.setAmount(request.getAmount());
        fare.setCurrency(request.getCurrency());
        fare.setValidFrom(request.getValidFrom());
        fare.setValidTo(request.getValidTo());

        Fare updatedFare = fareRepository.save(fare);
        return convertToResponse(updatedFare);
    }

    public void deleteFare(UUID id) {
        if (!fareRepository.existsById(id)) {
            throw new IllegalArgumentException("Fare not found with ID: " + id);
        }
        fareRepository.deleteById(id);
    }

    public Optional<FareResponse> getFareForJourney(UUID routeId, UUID originStopId, UUID destinationStopId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new IllegalArgumentException("Route not found with ID: " + routeId));
        BusStop originStop = busStopRepository.findById(originStopId)
                .orElseThrow(() -> new IllegalArgumentException("Origin Stop not found with ID: " + originStopId));
        BusStop destinationStop = busStopRepository.findById(destinationStopId)
                .orElseThrow(() -> new IllegalArgumentException("Destination Stop not found with ID: " + destinationStopId));

        // This method finds the most recently valid fare
        return fareRepository.findFirstByRouteAndOriginStopAndDestinationStopOrderByValidFromDesc(
                route, originStop, destinationStop
        ).map(this::convertToResponse);
    }

    private FareResponse convertToResponse(Fare fare) {
        FareResponse response = new FareResponse();
        response.setId(fare.getId());
        response.setAmount(fare.getAmount());
        response.setCurrency(fare.getCurrency());
        response.setValidFrom(fare.getValidFrom());
        response.setValidTo(fare.getValidTo());

        if (fare.getRoute() != null) {
            response.setRouteId(fare.getRoute().getId());
            response.setRouteName(fare.getRoute().getName());
        }

        if (fare.getOriginStop() != null) {
            response.setOriginStopId(fare.getOriginStop().getId());
            response.setOriginStopName(fare.getOriginStop().getName());
        }

        if (fare.getDestinationStop() != null) {
            response.setDestinationStopId(fare.getDestinationStop().getId());
            response.setDestinationStopName(fare.getDestinationStop().getName());
        }

        return response;
    }
}
