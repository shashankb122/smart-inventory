package com.smartinventory.smart_inventory.service;

import com.smartinventory.smart_inventory.dto.DashboardResponse;
import com.smartinventory.smart_inventory.entity.Sale;
import com.smartinventory.smart_inventory.entity.Product;
import com.smartinventory.smart_inventory.entity.User;
import com.smartinventory.smart_inventory.repository.ProductRepository;
import com.smartinventory.smart_inventory.repository.SaleRepository;
import com.smartinventory.smart_inventory.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final UserRepository userRepository;

    public DashboardService(
            ProductRepository productRepository,
            SaleRepository saleRepository,
            UserRepository userRepository) {

        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public DashboardResponse getDashboard() {
        User user = getAuthenticatedUser();

        List<Product> products = productRepository.findByUser(user);
        List<Sale> sales = saleRepository.findByUser(user);

        long totalStockUnits = products.stream()
                .mapToLong(Product::getCurrentStock)
                .sum();

        double totalInventoryValue = products.stream()
                .mapToDouble(product ->
                        product.getPrice() * product.getCurrentStock())
                .sum();

        double totalRevenue = sales.stream()
                .mapToDouble(Sale::getTotalAmount)
                .sum();

        List<DashboardResponse.Product> lowStockItems =
                products.stream()
                        .filter(product ->
                                product.getCurrentStock()
                                        <= product.getMinimumStock())
                        .map(product ->
                                DashboardResponse.Product.builder()
                                        .id(product.getId())
                                        .name(product.getName())
                                        .currentStock(product.getCurrentStock())
                                        .minimumStock(product.getMinimumStock())
                                        .build())
                        .toList();

        return DashboardResponse.builder()
                .totalProducts(products.size())
                .totalStockUnits(totalStockUnits)
                .totalInventoryValue(round(totalInventoryValue))
                .totalSales(sales.size())
                .totalRevenue(round(totalRevenue))
                .lowStockProducts(lowStockItems.size())
                .lowStockItems(lowStockItems)
                .build();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}