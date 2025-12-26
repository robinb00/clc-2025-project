package at.fhooe.dse.inventory_service.controller;

import at.fhooe.dse.inventory_service.repository.InventoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryRepository repository;

    @Test
    void testCreateAdjustAndGetInventory() throws Exception {
        UUID productId = UUID.randomUUID();

        mockMvc.perform(post("/inventory/{productId}", productId)
                        .param("quantity", "10"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/inventory/{productId}/adjust", productId)
                        .param("delta", "5"))
                .andExpect(status().isOk());

        var item = repository.findById(productId).orElseThrow();

        assertThat(item.getQuantity()).isEqualTo(15);
    }
}
