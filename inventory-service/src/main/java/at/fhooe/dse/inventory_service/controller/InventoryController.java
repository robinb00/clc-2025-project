package at.fhooe.dse.inventory_service.controller;

import at.fhooe.dse.inventory_service.model.InventoryItem;
import at.fhooe.dse.inventory_service.repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryRepository repository;

    public InventoryController(InventoryRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/{productId}")
    public InventoryItem create(
            @PathVariable UUID productId,
            @RequestParam int quantity) {

        InventoryItem item = new InventoryItem();
        item.setProductId(productId);
        item.setQuantity(quantity);
        return repository.save(item);
    }

    @PostMapping("/{productId}/adjust")
    public InventoryItem adjust(
            @PathVariable UUID productId,
            @RequestParam int delta) {

        InventoryItem item = repository.findById(productId).orElseThrow();
        item.setQuantity(item.getQuantity() + delta);
        return repository.save(item);
    }

    @GetMapping("/{productId}")
    public InventoryItem find(@PathVariable UUID productId) {
        return repository.findById(productId).orElseThrow();
    }

    @GetMapping
    public List<InventoryItem> findAll() {
        return repository.findAll();
    }

    @DeleteMapping("/{productId}")
    public void delete(@PathVariable UUID productId) {
        repository.deleteById(productId);
    }

    @PostMapping("/update-stock")
    public InventoryItem updateStock(@RequestBody StockUpdateDto dto) {

        System.out.println("📦 Inventory: Request for " + dto.productId);

        Optional<InventoryItem> existing = repository.findById(dto.productId);

        InventoryItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setQuantity(item.getQuantity() + dto.quantity);
        } else {
            item = new InventoryItem();
            item.setProductId(dto.productId);
            item.setQuantity(dto.quantity);
        }

        return repository.save(item);
    }

    public static class StockUpdateDto {
        public UUID productId;
        public int quantity;
    }
}
