package com.gocashless.ths.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class BusStopResponse {
    private UUID id;
    private String name;
}
