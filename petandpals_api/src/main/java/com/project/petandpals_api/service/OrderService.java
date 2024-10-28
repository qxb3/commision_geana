package com.project.petandpals_api.service;

import com.project.petandpals_api.entity.Product;
import com.project.petandpals_api.entity.User;
import com.project.petandpals_api.entity.order.Order;
import com.project.petandpals_api.entity.order.OrderItem;
import com.project.petandpals_api.repository.UserRepository;
import com.project.petandpals_api.repository.order.OrderItemRepository;
import com.project.petandpals_api.repository.order.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Order> findOrderByUserId(UUID userId) {
        return orderRepository.findByUserId(userId);
    }

    public Optional<Order> getOrderById(UUID orderId) {
        return orderRepository.findById(orderId);
    }

    public Order createOrder(UUID userId, List<Product> products, int quantity) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found."));

        Order newOrder = new Order();
        newOrder.setOrderDate(LocalDate.now());
        newOrder.setTotalPrice((float) products.stream().mapToDouble(Product::getPrice).sum());
        newOrder.setUser(user);

        for (Product product : products) {
            OrderItem newOrderItem = new OrderItem();
            newOrderItem.setOrder(newOrder);
            newOrderItem.setPrice(newOrderItem.getPrice());
            newOrderItem.setQuantity(quantity);
            newOrderItem.setProduct(product);

            newOrder.addOrderItems(newOrderItem);
        }

        orderRepository.save(newOrder);

        return newOrder;
    }

    public void deleteOrder(UUID orderId) {
        orderRepository.deleteById(orderId);
    }
}
