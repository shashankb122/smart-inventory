package com.smartinventory.smart_inventory.repository;

import com.smartinventory.smart_inventory.entity.Product;
import com.smartinventory.smart_inventory.entity.Sale;
import com.smartinventory.smart_inventory.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByProduct(Product product);

    // Keep this for DemandService / AIInventoryService
    List<Sale> findByProductAndSaleDateBetween(
            Product product,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Sale> findBySaleDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    // User-scoped methods
    List<Sale> findByUser(User user);

    List<Sale> findByProductAndUser(Product product, User user);

    List<Sale> findByUserAndSaleDateBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Sale> findByProductAndUserAndSaleDateBetween(
            Product product,
            User user,
            LocalDateTime start,
            LocalDateTime end
    );
}