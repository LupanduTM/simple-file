package com.gocashless.fakepay.client;

import com.gocashless.fakepay.client.dto.TransactionRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "transaction-history-service")
public interface TransactionHistoryServiceClient {

    @PostMapping("/api/v1/transactions")
    void createTransaction(@RequestBody TransactionRequest transactionRequest);
}
