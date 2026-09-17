package com.smartinventory.smart_inventory.controller;

import com.smartinventory.smart_inventory.dto.DemandResponse;
import com.smartinventory.smart_inventory.service.DemandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final DemandService demandService;

    public InventoryController(DemandService demandService) {
        this.demandService = demandService;
    }

    @GetMapping("/demand/{productId}")
    public ResponseEntity<DemandResponse> analyzeDemand(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                demandService.analyzeDemand(productId)
        );
    }
}