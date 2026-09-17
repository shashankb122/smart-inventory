package com.smartinventory.smart_inventory.repository;

import com.smartinventory.smart_inventory.entity.Product;
import com.smartinventory.smart_inventory.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByUser(User user);

    Optional<Product> findByIdAndUser(Long id, User user);

    List<Product> findByUserAndCurrentStockLessThanEqual(User user, Integer stock);

    List<Product> findByUserAndCategoryIgnoreCase(User user, String category);
}