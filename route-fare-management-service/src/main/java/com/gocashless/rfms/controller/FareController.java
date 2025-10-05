package com.gocashless.rfms.controller;

import com.gocashless.rfms.dto.FareRequest;
import com.gocashless.rfms.dto.FareResponse;
import com.gocashless.rfms.service.FareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/fares")
public class FareController {

    private final FareService fareService;

    @Autowired
    public FareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping
    public ResponseEntity<FareResponse> createFare(@RequestBody FareRequest request) {
        try {
            FareResponse newFare = fareService.createFare(request);
            return new ResponseEntity<>(newFare, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<FareResponse>> getAllFares() {
        List<FareResponse> fares = fareService.getAllFares();
        return new ResponseEntity<>(fares, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FareResponse> getFareById(@PathVariable UUID id) {
        return fareService.getFareById(id)
                .map(fare -> new ResponseEntity<>(fare, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FareResponse> updateFare(@PathVariable UUID id, @RequestBody FareRequest request) {
        try {
            FareResponse updatedFare = fareService.updateFare(id, request);
            return new ResponseEntity<>(updatedFare, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFare(@PathVariable UUID id) {
        try {
            fareService.deleteFare(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/lookup")
    public ResponseEntity<FareResponse> getFareForJourney(
            @RequestParam UUID routeId,
            @RequestParam UUID originStopId,
            @RequestParam UUID destinationStopId) {
        try {
            Optional<FareResponse> fare = fareService.getFareForJourney(routeId, originStopId, destinationStopId);
            return fare.map(f -> new ResponseEntity<>(f, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}