package com.smartinventory.smart_inventory.service;

import com.smartinventory.smart_inventory.dto.SaleRequest;
import com.smartinventory.smart_inventory.dto.SaleResponse;
import com.smartinventory.smart_inventory.entity.Product;
import com.smartinventory.smart_inventory.entity.Sale;
import com.smartinventory.smart_inventory.entity.User;
import com.smartinventory.smart_inventory.repository.ProductRepository;
import com.smartinventory.smart_inventory.repository.SaleRepository;
import com.smartinventory.smart_inventory.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public SaleService(
            SaleRepository saleRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public SaleResponse recordSale(SaleRequest request) {
        User user = getAuthenticatedUser();

        Product product = productRepository.findByIdAndUser(request.getProductId(), user)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        if (product.getCurrentStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        Integer newStock = product.getCurrentStock() - request.getQuantity();
        product.setCurrentStock(newStock);

        Double totalAmount = product.getPrice() * request.getQuantity();

        Sale sale = Sale.builder()
                .product(product)
                .user(user)
                .quantity(request.getQuantity())
                .totalAmount(totalAmount)
                .saleDate(LocalDateTime.now())
                .build();

        Sale savedSale = saleRepository.save(sale);
        productRepository.save(product);

        return SaleResponse.builder()
                .saleId(savedSale.getId())
                .productId(product.getId())
                .productName(product.getName())
                .quantity(savedSale.getQuantity())
                .totalAmount(savedSale.getTotalAmount())
                .remainingStock(product.getCurrentStock())
                .saleDate(savedSale.getSaleDate())
                .build();
    }

    public List<Sale> getAllSales() {
        User user = getAuthenticatedUser();
        return saleRepository.findByUser(user);
    }

    public List<Sale> getProductSales(Long productId) {
        User user = getAuthenticatedUser();

        Product product = productRepository.findByIdAndUser(productId, user)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        return saleRepository.findByProductAndUser(product, user);
    }
}