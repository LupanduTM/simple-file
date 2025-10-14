package com.gocashless.ths.service;

import com.gocashless.ths.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    @Autowired
    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getKpis() {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalRevenue", transactionRepository.getTotalRevenue());
        kpis.put("totalTransactions", transactionRepository.count());
        // Add more KPIs as needed
        return kpis;
    }

    public List<Map<String, Object>> getTransactionsOverTime() {
        return transactionRepository.getTransactionsOverTime();
    }

    public List<Map<String, Object>> getTransactionsByStatus() {
        return transactionRepository.getTransactionsByStatus();
    }

    public List<Map<String, Object>> getTransactionsByType() {
        return transactionRepository.getTransactionsByType();
    }

    public List<Map<String, Object>> getTopRoutes() {
        return transactionRepository.getTopRoutes();
    }

    public List<Map<String, Object>> getTopConductors() {
        return transactionRepository.getTopConductors();
    }
}
