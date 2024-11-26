package com.example.awscostexplorer.services;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.costexplorer.CostExplorerClient;
import software.amazon.awssdk.services.costexplorer.model.*;

@Service
public class CostExplorerService {

    private final CostExplorerClient ceClient;

    public CostExplorerService() {
        // Initialize AWS Cost Explorer client
        this.ceClient = CostExplorerClient.builder()
                .build();
    }

    public String fetchMonthlyCosts(String startDate, String endDate) {
        try {
            // Prepare request
            GetCostAndUsageRequest request = GetCostAndUsageRequest.builder()
                    .timePeriod(DateInterval.builder()
                            .start(startDate)
                            .end(endDate)
                            .build())
                    .granularity(Granularity.MONTHLY)
                    .metrics("UnblendedCost")
                    .build();

            // Fetch data
            GetCostAndUsageResponse response = ceClient.getCostAndUsage(request);

            // Process response
            StringBuilder result = new StringBuilder("AWS Cost Data:\n");
            response.resultsByTime().forEach(res -> {
                result.append("Time Period: ").append(res.timePeriod().start())
                        .append(" - ").append(res.timePeriod().end()).append("\n");
                res.total().forEach((metric, amount) -> {
                    result.append("Metric: ").append(metric).append(", Amount: $").append(amount.amount()).append("\n");
                });
            });

            return result.toString();
        } catch (CostExplorerException e) {
            return "Failed to fetch cost data: " + e.awsErrorDetails().errorMessage();
        }
    }
}
