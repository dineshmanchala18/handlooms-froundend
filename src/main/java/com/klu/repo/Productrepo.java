package com.klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.Products;

public interface Productrepo extends JpaRepository<Products, Long> {

}
