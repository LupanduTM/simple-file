
package com.gocashless.fakepay.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentTransferRequest {
    private String payerMsisdn;
    private String receiverMsisdn;
    private BigDecimal amount;
    private String externalId;
}
