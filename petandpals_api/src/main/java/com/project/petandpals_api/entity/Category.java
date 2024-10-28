package com.project.petandpals_api.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private final UUID id;
    @Column(unique = true)
    private String name;

    public Category() {
        this.id = UUID.randomUUID();
    }

    public void set(Category other) {
        this.setName(other.getName());
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
