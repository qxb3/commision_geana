package com.project.petandpals_api.controller.body;

import com.project.petandpals_api.entity.Product;

import java.util.List;

public class NewOrderBody {
    private List<Product> products;
    private int quantity;

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
