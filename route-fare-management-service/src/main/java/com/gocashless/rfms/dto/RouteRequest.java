package com.gocashless.rfms.dto;

import lombok.Data;

@Data
public class RouteRequest {
    private String name;
    private String description;
    private Boolean isActive;
}
