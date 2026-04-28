package com.klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.Payment;

public interface Paymentrepo extends JpaRepository<Payment, Long> {
}
