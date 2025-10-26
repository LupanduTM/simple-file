
package com.gocashless.rfms.service;

import com.gocashless.rfms.dto.FareRequest;
import com.gocashless.rfms.dto.FareResponse;
import com.gocashless.rfms.model.BusStop;
import com.gocashless.rfms.model.Fare;
import com.gocashless.rfms.model.Route;
import com.gocashless.rfms.repository.BusStopRepository;
import com.gocashless.rfms.repository.FareRepository;
import com.gocashless.rfms.repository.RouteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class FareServiceTest {

    @InjectMocks
    private FareService fareService;

    @Mock
    private FareRepository fareRepository;

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private BusStopRepository busStopRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateFare_Success() {
        // Given
        FareRequest request = new FareRequest();
        request.setRouteId(UUID.randomUUID());
        request.setOriginStopId(UUID.randomUUID());
        request.setDestinationStopId(UUID.randomUUID());
        request.setAmount(BigDecimal.valueOf(10.0));

        Route route = new Route();
        route.setId(request.getRouteId());
        BusStop origin = new BusStop();
        origin.setId(request.getOriginStopId());
        BusStop destination = new BusStop();
        destination.setId(request.getDestinationStopId());

        when(routeRepository.findById(request.getRouteId())).thenReturn(Optional.of(route));
        when(busStopRepository.findById(request.getOriginStopId())).thenReturn(Optional.of(origin));
        when(busStopRepository.findById(request.getDestinationStopId())).thenReturn(Optional.of(destination));
        when(fareRepository.save(any(Fare.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        FareResponse response = fareService.createFare(request);

        // Then
        assertNotNull(response);
        assertEquals(request.getAmount(), response.getAmount());
    }

    @Test
    public void testCreateFare_RouteNotFound() {
        // Given
        FareRequest request = new FareRequest();
        request.setRouteId(UUID.randomUUID());

        when(routeRepository.findById(request.getRouteId())).thenReturn(Optional.empty());

        // Then
        assertThrows(IllegalArgumentException.class, () -> {
            // When
            fareService.createFare(request);
        });
    }

    @Test
    public void testCreateFare_OriginStopNotFound() {
        // Given
        FareRequest request = new FareRequest();
        request.setRouteId(UUID.randomUUID());
        request.setOriginStopId(UUID.randomUUID());

        Route route = new Route();
        route.setId(request.getRouteId());

        when(routeRepository.findById(request.getRouteId())).thenReturn(Optional.of(route));
        when(busStopRepository.findById(request.getOriginStopId())).thenReturn(Optional.empty());

        // Then
        assertThrows(IllegalArgumentException.class, () -> {
            // When
            fareService.createFare(request);
        });
    }

    @Test
    public void testCreateFare_DestinationStopNotFound() {
        // Given
        FareRequest request = new FareRequest();
        request.setRouteId(UUID.randomUUID());
        request.setOriginStopId(UUID.randomUUID());
        request.setDestinationStopId(UUID.randomUUID());

        Route route = new Route();
        route.setId(request.getRouteId());
        BusStop origin = new BusStop();
        origin.setId(request.getOriginStopId());

        when(routeRepository.findById(request.getRouteId())).thenReturn(Optional.of(route));
        when(busStopRepository.findById(request.getOriginStopId())).thenReturn(Optional.of(origin));
        when(busStopRepository.findById(request.getDestinationStopId())).thenReturn(Optional.empty());

        // Then
        assertThrows(IllegalArgumentException.class, () -> {
            // When
            fareService.createFare(request);
        });
    }

    @Test
    public void testGetFareForJourney_Success() {
        // Given
        UUID routeId = UUID.randomUUID();
        UUID originStopId = UUID.randomUUID();
        UUID destinationStopId = UUID.randomUUID();

        Route route = new Route();
        route.setId(routeId);
        BusStop origin = new BusStop();
        origin.setId(originStopId);
        BusStop destination = new BusStop();
        destination.setId(destinationStopId);
        Fare fare = new Fare();
        fare.setAmount(BigDecimal.valueOf(15.0));

        when(routeRepository.findById(routeId)).thenReturn(Optional.of(route));
        when(busStopRepository.findById(originStopId)).thenReturn(Optional.of(origin));
        when(busStopRepository.findById(destinationStopId)).thenReturn(Optional.of(destination));
        when(fareRepository.findFirstByRouteAndOriginStopAndDestinationStopOrderByValidFromDesc(route, origin, destination))
                .thenReturn(Optional.of(fare));

        // When
        Optional<FareResponse> response = fareService.getFareForJourney(routeId, originStopId, destinationStopId);

        // Then
        assertTrue(response.isPresent());
        assertEquals(fare.getAmount(), response.get().getAmount());
    }

    @Test
    public void testGetFareForJourney_NotFound() {
        // Given
        UUID routeId = UUID.randomUUID();
        UUID originStopId = UUID.randomUUID();
        UUID destinationStopId = UUID.randomUUID();

        Route route = new Route();
        route.setId(routeId);
        BusStop origin = new BusStop();
        origin.setId(originStopId);
        BusStop destination = new BusStop();
        destination.setId(destinationStopId);

        when(routeRepository.findById(routeId)).thenReturn(Optional.of(route));
        when(busStopRepository.findById(originStopId)).thenReturn(Optional.of(origin));
        when(busStopRepository.findById(destinationStopId)).thenReturn(Optional.of(destination));
        when(fareRepository.findFirstByRouteAndOriginStopAndDestinationStopOrderByValidFromDesc(route, origin, destination))
                .thenReturn(Optional.empty());

        // When
        Optional<FareResponse> response = fareService.getFareForJourney(routeId, originStopId, destinationStopId);

        // Then
        assertFalse(response.isPresent());
    }
}
