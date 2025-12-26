package at.fhooe.dse.master_data_service.repository;

import at.fhooe.dse.master_data_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
}

