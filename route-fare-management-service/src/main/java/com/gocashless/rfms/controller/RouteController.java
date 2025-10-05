package com.gocashless.rfms.controller;

import com.gocashless.rfms.dto.RouteResponse;
import com.gocashless.rfms.model.Route;
import com.gocashless.rfms.service.RouteService;
import com.gocashless.rfms.dto.RouteRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/routes")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody RouteRequest request) {
        try {
            Route newRoute = routeService.createRoute(request);
            return new ResponseEntity<>(newRoute, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<RouteResponse>> getAllRoutes() {
        List<RouteResponse> routes = routeService.getAllRoutes();
        return new ResponseEntity<>(routes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteResponse> getRouteById(@PathVariable UUID id) {
        return routeService.getRouteById(id)
                .map(route -> new ResponseEntity<>(route, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> updateRoute(@PathVariable UUID id, @RequestBody RouteRequest request) {
        try {
            Route updatedRoute = routeService.updateRoute(id, request);
            return new ResponseEntity<>(updatedRoute, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable UUID id) {
        routeService.deleteRoute(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
