package com.gocashless.rfms.controller;

import com.gocashless.rfms.model.Fare;
import com.gocashless.rfms.service.FareService;
import com.gocashless.rfms.dto.FareRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/fares")
public class FareController {

    private final FareService fareService;

    @Autowired
    public FareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping
    public ResponseEntity<Fare> createFare(@RequestBody FareRequest request) {
        try {
            Fare newFare = fareService.createFare(request);
            return new ResponseEntity<>(newFare, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fare> getFareById(@PathVariable UUID id) {
        return fareService.getFareById(id)
                .map(fare -> new ResponseEntity<>(fare, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/lookup")
    public ResponseEntity<Fare> getFareForJourney(
            @RequestParam UUID routeId,
            @RequestParam UUID originStopId,
            @RequestParam UUID destinationStopId) {
        try {
            Optional<Fare> fare = fareService.getFareForJourney(routeId, originStopId, destinationStopId);
            return fare.map(f -> new ResponseEntity<>(f, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}