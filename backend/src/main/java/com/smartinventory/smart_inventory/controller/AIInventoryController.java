package com.smartinventory.smart_inventory.controller;

import com.smartinventory.smart_inventory.dto.AIAdviceResponse;
import com.smartinventory.smart_inventory.service.AIInventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIInventoryController {

    private final AIInventoryService aiInventoryService;

    public AIInventoryController(
            AIInventoryService aiInventoryService) {

        this.aiInventoryService = aiInventoryService;
    }

    @GetMapping("/advice/{productId}")
    public ResponseEntity<AIAdviceResponse> getAdvice(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                aiInventoryService.getInventoryAdvice(productId)
        );
    }
}