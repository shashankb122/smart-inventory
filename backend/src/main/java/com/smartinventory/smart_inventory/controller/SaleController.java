package com.smartinventory.smart_inventory.controller;

import com.smartinventory.smart_inventory.dto.SaleRequest;
import com.smartinventory.smart_inventory.dto.SaleResponse;
import com.smartinventory.smart_inventory.entity.Sale;
import com.smartinventory.smart_inventory.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public ResponseEntity<SaleResponse> recordSale(
            @Valid @RequestBody SaleRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saleService.recordSale(request));
    }

    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {

        return ResponseEntity.ok(
                saleService.getAllSales()
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Sale>> getProductSales(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                saleService.getProductSales(productId)
        );
    }
}