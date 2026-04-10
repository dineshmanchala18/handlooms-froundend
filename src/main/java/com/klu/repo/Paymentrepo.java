package com.klu.repo;

import org.springframework.data.repository.Repository;

import com.klu.model.Payment;

public interface Paymentrepo extends Repository<Payment, Long> {

	Payment save(Payment p);

}
