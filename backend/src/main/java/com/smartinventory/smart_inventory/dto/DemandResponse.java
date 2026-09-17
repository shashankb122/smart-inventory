package com.smartinventory.smart_inventory.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DemandResponse {

    private Long productId;
    private String productName;

    private Integer currentStock;

    private Double averageDailySales;

    private Double estimated7DayDemand;
    private Double estimated30DayDemand;

    private Integer leadTimeDays;
    private Double leadTimeDemand;

    private Double safetyStock;
    private Double reorderPoint;

    private String recommendation;
}