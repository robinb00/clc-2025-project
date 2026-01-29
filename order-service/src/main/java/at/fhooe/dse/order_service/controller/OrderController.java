package at.fhooe.dse.order_service.controller;

import at.fhooe.dse.order_service.model.Order;
import at.fhooe.dse.order_service.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import at.fhooe.dse.order_service.service.OrderService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;
    private final OrderRepository repository;
    public OrderController(OrderRepository repository, OrderService orderService) {
        this.repository = repository;
        this.orderService = orderService;
    }

   // @PostMapping
    //public Order create(@RequestBody Order order) {
     //   order.setStatus("CREATED");
      //  return repository.save(order);
    //}

    @PostMapping
    public Order create(@RequestBody Order order) {
        Order savedOrder = orderService.saveOrder(order);

        orderService.notifyInventory(savedOrder.getProductId(), savedOrder.getQuantity());

        return savedOrder;
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
