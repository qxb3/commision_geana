package com.project.petandpals_api.controller;

import com.project.petandpals_api.controller.body.AddCartBody;
import com.project.petandpals_api.entity.cart.Cart;
import com.project.petandpals_api.entity.cart.CartItem;
import com.project.petandpals_api.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/user/{userId}")
    public Optional<Cart> getAllCartItems(@PathVariable UUID userId) {
        return cartService.findAllCartItems(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItem> getCartItemById(@PathVariable UUID id) {
        return cartService.getCartItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}")
    public Cart addCartItem(@PathVariable UUID userId, @RequestBody AddCartBody body) {
        return cartService.addCartItem(userId, body.getProduct(), body.getQuantity());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCartItem(@PathVariable UUID id) {
        cartService.deleteCartItem(id);
        return ResponseEntity.noContent().build();
    }
}