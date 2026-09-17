package com.smartinventory.smart_inventory.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DashboardResponse {

    private long totalProducts;

    private long totalStockUnits;

    private double totalInventoryValue;

    private long totalSales;

    private double totalRevenue;

    private long lowStockProducts;

    private List<Product> lowStockItems;

    @Getter
    @Builder
    public static class Product {
        private Long id;
        private String name;
        private Integer currentStock;
        private Integer minimumStock;
    }
}