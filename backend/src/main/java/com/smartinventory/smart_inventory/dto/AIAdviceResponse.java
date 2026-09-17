package com.smartinventory.smart_inventory.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AIAdviceResponse {

    private Long productId;
    private String productName;

    private String riskLevel;
    private String recommendation;
    private String explanation;
}