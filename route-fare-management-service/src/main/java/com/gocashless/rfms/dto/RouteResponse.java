package com.gocashless.rfms.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class RouteResponse {
    private UUID id;
    private String name;
    private String description;
    private Boolean isActive;
}