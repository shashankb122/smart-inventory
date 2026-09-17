package com.smartinventory.smart_inventory.service;

import com.smartinventory.smart_inventory.dto.DemandResponse;
import com.smartinventory.smart_inventory.entity.Product;
import com.smartinventory.smart_inventory.entity.Sale;
import com.smartinventory.smart_inventory.repository.ProductRepository;
import com.smartinventory.smart_inventory.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DemandService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    public DemandService(
            ProductRepository productRepository,
            SaleRepository saleRepository) {

        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    public DemandResponse analyzeDemand(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + productId
                        ));

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(30);

        List<Sale> sales =
                saleRepository.findByProductAndSaleDateBetween(
                        product,
                        startDate,
                        endDate
                );

        int totalUnitsSold = sales.stream()
                .mapToInt(Sale::getQuantity)
                .sum();

        double averageDailySales =
                totalUnitsSold / 30.0;

        double estimated7DayDemand =
                averageDailySales * 7;

        double estimated30DayDemand =
                averageDailySales * 30;

        double leadTimeDemand =
                averageDailySales * product.getLeadTimeDays();

        double safetyStock =
                averageDailySales * 3;

        double reorderPoint =
                leadTimeDemand + safetyStock;

        String recommendation;

        if (product.getCurrentStock() <= reorderPoint) {
            recommendation = "REORDER REQUIRED";
        } else {
            recommendation = "SUFFICIENT STOCK";
        }

        return DemandResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .currentStock(product.getCurrentStock())
                .averageDailySales(round(averageDailySales))
                .estimated7DayDemand(round(estimated7DayDemand))
                .estimated30DayDemand(round(estimated30DayDemand))
                .leadTimeDays(product.getLeadTimeDays())
                .leadTimeDemand(round(leadTimeDemand))
                .safetyStock(round(safetyStock))
                .reorderPoint(round(reorderPoint))
                .recommendation(recommendation)
                .build();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}