package com.gocashless.ths.controller;

import com.gocashless.ths.dto.TransactionResponse;
import com.gocashless.ths.model.Transaction;
import com.gocashless.ths.service.DashboardService;
import com.gocashless.ths.service.TransactionService;
import com.gocashless.ths.dto.TransactionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@CrossOrigin(origins = "*") // Allow all origins for now
public class TransactionController {

    private final TransactionService transactionService;
    private final DashboardService dashboardService;

    @Autowired
    public TransactionController(TransactionService transactionService, DashboardService dashboardService) {
        this.transactionService = transactionService;
        this.dashboardService = dashboardService;
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody TransactionRequest request) {
        try {
            Transaction newTransaction = transactionService.createTransaction(request);
            return new ResponseEntity<>(newTransaction, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable UUID id) {
        return transactionService.getTransactionById(id)
                .map(transaction -> new ResponseEntity<>(transaction, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByUserId(@PathVariable UUID userId) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByUserId(userId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/conductor/{conductorId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByConductorId(@PathVariable UUID conductorId) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByConductorId(conductorId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Transaction> transactions = transactionService.getTransactionsByDateRange(startDate, endDate);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Dashboard Endpoints
    @GetMapping("/stats/kpis")
    public ResponseEntity<Map<String, Object>> getKpis() {
        return new ResponseEntity<>(dashboardService.getKpis(), HttpStatus.OK);
    }

    @GetMapping("/stats/over-time")
    public ResponseEntity<List<Map<String, Object>>> getTransactionsOverTime() {
        return new ResponseEntity<>(dashboardService.getTransactionsOverTime(), HttpStatus.OK);
    }

    @GetMapping("/stats/by-status")
    public ResponseEntity<List<Map<String, Object>>> getTransactionsByStatus() {
        return new ResponseEntity<>(dashboardService.getTransactionsByStatus(), HttpStatus.OK);
    }

    @GetMapping("/stats/by-type")
    public ResponseEntity<List<Map<String, Object>>> getTransactionsByType() {
        return new ResponseEntity<>(dashboardService.getTransactionsByType(), HttpStatus.OK);
    }

    @GetMapping("/stats/top-routes")
    public ResponseEntity<List<Map<String, Object>>> getTopRoutes() {
        return new ResponseEntity<>(dashboardService.getTopRoutes(), HttpStatus.OK);
    }
}
