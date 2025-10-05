package com.gocashless.rfms.controller;

import com.gocashless.rfms.dto.BusStopResponse;
import com.gocashless.rfms.model.BusStop;
import com.gocashless.rfms.service.BusStopService;
import com.gocashless.rfms.dto.BusStopRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<List<BusStopResponse>> getAllBusStops() {
        List<BusStopResponse> busStops = busStopService.getAllBusStops();
        return new ResponseEntity<>(busStops, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusStopResponse> getBusStopById(@PathVariable UUID id) {
        return busStopService.getBusStopById(id)
                .map(busStop -> new ResponseEntity<>(busStop, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-route/{routeId}")
    public ResponseEntity<List<BusStopResponse>> getBusStopsByRoute(@PathVariable UUID routeId) {
        try {
            List<BusStopResponse> busStops = busStopService.getBusStopsByRoute(routeId);
            return new ResponseEntity<>(busStops, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBusStop(@PathVariable UUID id) {
        busStopService.deleteBusStop(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusStopResponse> updateBusStop(@PathVariable UUID id, @RequestBody BusStopRequest request) {
        try {
            BusStopResponse updatedBusStop = busStopService.updateBusStop(id, request);
            return new ResponseEntity<>(updatedBusStop, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

