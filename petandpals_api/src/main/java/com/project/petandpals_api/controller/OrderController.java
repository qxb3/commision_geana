package com.project.petandpals_api.controller;

import com.project.petandpals_api.controller.body.NewOrderBody;
import com.project.petandpals_api.entity.Product;
import com.project.petandpals_api.entity.order.Order;
import com.project.petandpals_api.service.OrderService;
import com.project.petandpals_api.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
   @Autowired
   private OrderService orderService;
   @Autowired
   private ProductService productService;

   @GetMapping("/{orderId}")
   public Optional<Order> getOrderById(@PathVariable UUID orderId) {
      return orderService.getOrderById(orderId);
   }

   @GetMapping("/user/{userId}")
   public List<Order> findOrderByUser(@PathVariable UUID userId) {
      return orderService.findOrderByUserId(userId);
   }

   @PostMapping("/user/{userId}")
   public Order createOrder(@PathVariable UUID userId, @RequestBody NewOrderBody body) {
      List<Product> products = body.getProducts().stream()
              .map((product) -> productService.getProductById(product.getId()))
              .flatMap(Optional::stream)
              .toList();

      return orderService.createOrder(userId, products, body.getQuantity());
   }

   @DeleteMapping("/{orderId}")
   public ResponseEntity<Void> deleteOrder(@PathVariable UUID orderId) {
      orderService.deleteOrder(orderId);
      return ResponseEntity.noContent().build();
   }
}
