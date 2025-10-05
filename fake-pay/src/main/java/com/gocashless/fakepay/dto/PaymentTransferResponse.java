
package com.gocashless.fakepay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransferResponse {
    private String transactionId;
    private String status;
    private String message;
}
