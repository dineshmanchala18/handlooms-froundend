package com.klu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Products;
import com.klu.repo.Productrepo;

@Service
public class ProductService {

    @Autowired
    Productrepo pr;

    public List<Products> getAllProducts() {
        return pr.findAll();
    }

    // Save
    public Products saveProduct(Products p) {
        return pr.save(p);
    }

    // Delete
    public String deleteProduct(Long id) {
        pr.deleteById(id);
        return "delete success";
    }

    // Update
    public Products updateProduct(Long id, Products updatedProduct) {
        Products existingProduct = pr.findById(id).orElse(null);

        if (existingProduct != null) {
            existingProduct.setProductname(updatedProduct.getProductname());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setQuantity(updatedProduct.getQuantity());

            return pr.save(existingProduct);
        }

        return null;
    }
}
