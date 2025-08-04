package com.gocashless.qrgs.model;

import lombok.Data;
import java.util.UUID;

@Data
public class QrGenerateRequest {
    private UUID conductorId;
    private UUID routeId;
    private UUID originStopId;
    private UUID destinationStopId;
    // Add any other data needed for fare lookup or QR payload
}
