package com.example.awscostexplorer.controllers;

import com.example.awscostexplorer.services.CostExplorerService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CostExplorerController {

    private final CostExplorerService costExplorerService;

    public CostExplorerController(CostExplorerService costExplorerService) {
        this.costExplorerService = costExplorerService;
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/fetch-costs")
    public String fetchCosts(@RequestParam String startDate, @RequestParam String endDate) {
        return costExplorerService.fetchMonthlyCosts(startDate, endDate);
    }
}
