package com.smartinventory.smart_inventory.service;

import com.smartinventory.smart_inventory.dto.AIAdviceResponse;
import com.smartinventory.smart_inventory.dto.DemandResponse;
import com.smartinventory.smart_inventory.entity.Product;
import com.smartinventory.smart_inventory.repository.ProductRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIInventoryService {

    private final ProductRepository productRepository;
    private final DemandService demandService;
    private final ChatClient chatClient;

    public AIInventoryService(
            ProductRepository productRepository,
            DemandService demandService,
            ChatClient.Builder chatClientBuilder) {

        this.productRepository = productRepository;
        this.demandService = demandService;
        this.chatClient = chatClientBuilder.build();
    }

    public AIAdviceResponse getInventoryAdvice(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + productId
                        ));

        DemandResponse demand =
                demandService.analyzeDemand(productId);

        String prompt = """
                You are an inventory management assistant.

                Analyze the following inventory information:

                Product: %s
                Current Stock: %d
                Average Daily Sales: %.2f
                Estimated 7 Day Demand: %.2f
                Estimated 30 Day Demand: %.2f
                Lead Time: %d days
                Lead Time Demand: %.2f
                Safety Stock: %.2f
                Reorder Point: %.2f
                Current Recommendation: %s

                Give practical inventory advice.

                Respond in exactly this format:

                RISK: LOW/MEDIUM/HIGH
                RECOMMENDATION: your recommendation
                EXPLANATION: short explanation
                """.formatted(
                product.getName(),
                product.getCurrentStock(),
                demand.getAverageDailySales(),
                demand.getEstimated7DayDemand(),
                demand.getEstimated30DayDemand(),
                demand.getLeadTimeDays(),
                demand.getLeadTimeDemand(),
                demand.getSafetyStock(),
                demand.getReorderPoint(),
                demand.getRecommendation()
        );

        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        String risk = extract(response, "RISK:");
        String recommendation = extract(response, "RECOMMENDATION:");
        String explanation = extract(response, "EXPLANATION:");

        return AIAdviceResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .riskLevel(risk)
                .recommendation(recommendation)
                .explanation(explanation)
                .build();
    }

    private String extract(String response, String key) {

        int start = response.indexOf(key);

        if (start == -1) {
            return "Not available";
        }

        start += key.length();

        int end = response.indexOf("\n", start);

        if (end == -1) {
            end = response.length();
        }

        return response.substring(start, end).trim();
    }
}