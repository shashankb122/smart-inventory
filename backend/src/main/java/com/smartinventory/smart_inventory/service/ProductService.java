package com.smartinventory.smart_inventory.service;

import com.smartinventory.smart_inventory.entity.Product;
import com.smartinventory.smart_inventory.entity.User;
import com.smartinventory.smart_inventory.repository.ProductRepository;
import com.smartinventory.smart_inventory.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public Product addProduct(Product product) {
        User user = getAuthenticatedUser();
        product.setUser(user);
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        User user = getAuthenticatedUser();
        return productRepository.findByUser(user);
    }

    public Product getProductById(Long id) {
        User user = getAuthenticatedUser();
        return productRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = getProductById(id);

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setCurrentStock(updatedProduct.getCurrentStock());
        existingProduct.setMinimumStock(updatedProduct.getMinimumStock());
        existingProduct.setSupplier(updatedProduct.getSupplier());
        existingProduct.setLeadTimeDays(updatedProduct.getLeadTimeDays());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public Product updateStock(Long id, Integer newStock) {
        Product product = getProductById(id);
        product.setCurrentStock(newStock);
        return productRepository.save(product);
    }

    public List<Product> getLowStockProducts() {
        User user = getAuthenticatedUser();
        return productRepository.findByUserAndCurrentStockLessThanEqual(user, 20);
    }
}