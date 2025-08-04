package com.gocashless.rfms.controller;

import com.gocashless.rfms.model.BusStop;
import com.gocashless.rfms.service.BusStopService;
import com.gocashless.rfms.dto.BusStopRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bus-stops")
public class BusStopController {

    private final BusStopService busStopService;

    @Autowired
    public BusStopController(BusStopService busStopService) {
        this.busStopService = busStopService;
    }

    @PostMapping
    public ResponseEntity<BusStop> createBusStop(@RequestBody BusStopRequest request) {
        try {
            BusStop newBusStop = busStopService.createBusStop(request);
            return new ResponseEntity<>(newBusStop, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<BusStop>> getAllBusStops() {
        List<BusStop> busStops = busStopService.getAllBusStops();
        return new ResponseEntity<>(busStops, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusStop> getBusStopById(@PathVariable UUID id) {
        return busStopService.getBusStopById(id)
                .map(busStop -> new ResponseEntity<>(busStop, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-route/{routeId}")
    public ResponseEntity<List<BusStop>> getBusStopsByRoute(@PathVariable UUID routeId) {
        try {
            List<BusStop> busStops = busStopService.getBusStopsByRoute(routeId);
            return new ResponseEntity<>(busStops, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}

