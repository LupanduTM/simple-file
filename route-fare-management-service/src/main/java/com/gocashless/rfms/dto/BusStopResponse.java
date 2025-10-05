package com.gocashless.rfms.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class BusStopResponse {
    private UUID id;
    private String name;
    private Double latitude;
    private Double longitude;
    private UUID routeId;
    private String routeName;
    private Integer orderInRoute;
}
