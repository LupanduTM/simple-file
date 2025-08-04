package com.gocashless.rfms.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class BusStopRequest {
    private String name;
    private Double latitude;
    private Double longitude;
    private UUID routeId; // Optional, if a stop belongs to a specific route
    private Integer orderInRoute; // Optional, for ordering stops on a route
}
