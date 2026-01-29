package at.fhooe.dse.order_service.service;

import at.fhooe.dse.order_service.model.Order;
import at.fhooe.dse.order_service.repository.OrderRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final RestTemplate restTemplate = new RestTemplate(); // For HTTP calls

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public Order saveOrder(Order order) {
        order.setStatus("CREATED");
        return repository.save(order);
    }

    // Notify the Inventory Service
    @Async
    public void notifyInventory(UUID productId, int quantity) {
        try {

            String url = "http://inventory-service:8080/inventory/update-stock";

            StockUpdateDto request = new StockUpdateDto(productId, quantity);

            restTemplate.postForObject(url, request, String.class);
            System.out.println("Inventory successfully notified!");

        } catch (Exception e) {
            System.err.println("Error updating inventory: " + e.getMessage());
        }
    }

    public static class StockUpdateDto {
        public UUID productId;
        public int quantity;

        public StockUpdateDto(UUID productId, int quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public StockUpdateDto() {}

        public UUID getProductId() { return productId; }
        public int getQuantity() { return quantity; }
    }
}
