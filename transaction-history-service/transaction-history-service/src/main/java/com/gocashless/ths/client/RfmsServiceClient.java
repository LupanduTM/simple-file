package com.gocashless.ths.client;

import com.gocashless.ths.dto.BusStopResponse;
import com.gocashless.ths.dto.RouteResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "route-fare-management-service")
public interface RfmsServiceClient {

    @GetMapping("/api/v1/routes/{id}")
    RouteResponse getRouteById(@PathVariable("id") UUID id);

    @GetMapping("/api/v1/bus-stops/{id}")
    BusStopResponse getBusStopById(@PathVariable("id") UUID id);
}
