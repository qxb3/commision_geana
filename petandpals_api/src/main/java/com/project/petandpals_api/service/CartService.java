package com.project.petandpals_api.service;

import com.project.petandpals_api.entity.Product;
import com.project.petandpals_api.entity.User;
import com.project.petandpals_api.entity.cart.Cart;
import com.project.petandpals_api.entity.cart.CartItem;
import com.project.petandpals_api.repository.UserRepository;
import com.project.petandpals_api.repository.cart.CartItemRepository;
import com.project.petandpals_api.repository.cart.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;

    public Optional<Cart> findAllCartItems(UUID userId) {
        return cartRepository.findByUserId(userId);
    }

    public Optional<CartItem> getCartItemById(UUID id) {
        return cartItemRepository.findById(id);
    }

    public Cart addCartItem(UUID userId, Product product, int quantity) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart not found."));

        Optional<Cart> existingCart = cartRepository.findByUserId(user.getId());
        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            Set<CartItem> cartItems = cart.getCartItems();

            CartItem newCartItem = new CartItem();
            newCartItem.setProduct(product);
            newCartItem.setQuantity(quantity);
            cartItemRepository.saveAndFlush(newCartItem);

            cartItems.add(newCartItem);
            cart.setCartItems(cartItems);

            try {
                return cartRepository.save(cart);
            } catch (DataIntegrityViolationException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
            }
        } else {
            Cart newCart = new Cart();
            newCart.setUser(user);

            try {
                cartRepository.save(newCart);
                return addCartItem(userId, product, quantity);
            } catch (DataIntegrityViolationException e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Cart already exists.");
            }
        }
    }

    public void deleteCartItem(UUID id) {
        cartItemRepository.deleteById(id);
    }
}
