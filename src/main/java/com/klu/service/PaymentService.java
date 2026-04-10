package com.klu.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Payment;
import com.klu.repo.Paymentrepo;

@Service
public class PaymentService {

    @Autowired
    private Paymentrepo repo;

    public Payment processPayment(Payment payment) {

        String method = payment.getMethod();

        if (method.equalsIgnoreCase("UPI")) {
            if (payment.getUpiId() == null || payment.getUpiId().isEmpty()) {
                payment.setStatus("FAILED - UPI ID REQUIRED");
                return payment;
            }
        }

        else if (method.equalsIgnoreCase("Credit Card")) {
            if (payment.getCardNumber() == null || payment.getCvv() == null) {
                payment.setStatus("FAILED - CARD DETAILS REQUIRED");
                return payment;
            }
        }

        else if (method.equalsIgnoreCase("Bank")) {
            if (payment.getAccountNumber() == null || payment.getIfscCode() == null) {
                payment.setStatus("FAILED - BANK DETAILS REQUIRED");
                return payment;
            }
        }

        else if (method.equalsIgnoreCase("PayPal")) {
            if (payment.getPaypalEmail() == null) {
                payment.setStatus("FAILED - EMAIL REQUIRED");
                return payment;
            }
        }

        payment.setStatus("SUCCESS");
        return repo.save(payment);
    }
}