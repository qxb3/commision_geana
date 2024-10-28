package com.project.petandpals_api.service;

import com.project.petandpals_api.entity.Pet;
import com.project.petandpals_api.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PetService {
    @Autowired
    private PetRepository petRepository;

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Optional<Pet> getPetById(UUID id) {
        return petRepository.findById(id);
    }

    public Pet createPet(Pet product) {
        try {
            return petRepository.save(product);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Pet already exists.");
        }
    }

    public Pet updatePet(UUID id, Pet productDetails) {
        Pet product = petRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pet not found."));

        product.set(productDetails);

        return petRepository.save(product);
    }

    public void deletePet(UUID id) {
        petRepository.deleteById(id);
    }
}
