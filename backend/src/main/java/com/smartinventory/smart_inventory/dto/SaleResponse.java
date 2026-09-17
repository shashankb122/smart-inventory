package com.smartinventory.smart_inventory.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SaleResponse {

    private Long saleId;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double totalAmount;
    private Integer remainingStock;
    private LocalDateTime saleDate;
}