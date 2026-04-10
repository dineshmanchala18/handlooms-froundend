package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klu.model.Products;
import com.klu.service.ProductService;

@RestController
@RequestMapping("/Product")
@CrossOrigin
public class ProductController {

    @Autowired
    ProductService pr;

    @GetMapping("/all")
    public List<Products> getAllProducts() {
        return pr.getAllProducts();
    }

    @PostMapping
    public ResponseEntity<Products> createProduct(@RequestBody Products p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pr.saveProduct(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProductForDashboard(@PathVariable Long id, @RequestBody Products p) {
        Products updatedProduct = pr.updateProduct(id, p);

        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductForDashboard(@PathVariable Long id) {
        pr.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/saveProduct")
    public Products saveProduct(@RequestBody Products p) {
        return pr.saveProduct(p);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public String deleteProduct(@PathVariable Long id) {
        return pr.deleteProduct(id);
    }

    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Products p) {
        Products updatedProduct = pr.updateProduct(id, p);

        if (updatedProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("product not found");
        }

        return ResponseEntity.ok(updatedProduct);
    }
}
