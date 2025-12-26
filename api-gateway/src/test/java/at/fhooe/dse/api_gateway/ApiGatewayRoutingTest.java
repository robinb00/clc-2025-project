package at.fhooe.dse.api_gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
@AutoConfigureWireMock(port = 0)
@ActiveProfiles("test")
class ApiGatewayRoutingTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void routesProductsToMasterDataService() {
        stubFor(get(urlEqualTo("/products"))
                .willReturn(okJson("""
                    [{"id":1,"name":"Widget"}]
                """)));

        webTestClient.get()
                .uri("/products")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$[0].name").isEqualTo("Widget");
    }

    @Test
    void routesOrdersToOrderService() {
        stubFor(get(urlEqualTo("/orders"))
                .willReturn(okJson("""
                    [{"id":1,"status":"CREATED"}]
                """)));

        webTestClient.get()
                .uri("/orders")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$[0].status").isEqualTo("CREATED");
    }

    @Test
    void routesInventoryToInventoryService() {
        stubFor(get(urlEqualTo("/inventory/123"))
                .willReturn(okJson("""
                    {"productId":"123","quantity":10}
                """)));

        webTestClient.get()
                .uri("/inventory/123")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.quantity").isEqualTo(10);
    }
}
