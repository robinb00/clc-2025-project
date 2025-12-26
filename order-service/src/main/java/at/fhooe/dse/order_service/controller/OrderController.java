package at.fhooe.dse.order_service.controller;

import at.fhooe.dse.order_service.model.Order;
import at.fhooe.dse.order_service.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository repository;

    public OrderController(OrderRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setStatus("CREATED");
        return repository.save(order);
    }

    @GetMapping
    public List<Order> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Order findById(@PathVariable UUID id) {
        return repository.findById(id).orElseThrow();
    }
}
