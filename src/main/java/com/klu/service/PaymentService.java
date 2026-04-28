package com.klu.service;

import java.util.List;

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
                return repo.save(payment);
            }
        }

        else if (method.equalsIgnoreCase("Credit Card") || method.equalsIgnoreCase("card")) {
            if (payment.getCardNumber() == null || payment.getCvv() == null) {
                payment.setStatus("FAILED - CARD DETAILS REQUIRED");
                return repo.save(payment);
            }
        }

        else if (method.equalsIgnoreCase("Bank") || method.equalsIgnoreCase("bank")) {
            if (payment.getAccountNumber() == null || payment.getIfscCode() == null) {
                payment.setStatus("FAILED - BANK DETAILS REQUIRED");
                return repo.save(payment);
            }
        }

        else if (method.equalsIgnoreCase("PayPal") || method.equalsIgnoreCase("paypal")) {
            if (payment.getPaypalEmail() == null) {
                payment.setStatus("FAILED - EMAIL REQUIRED");
                return repo.save(payment);
            }
        }

        payment.setStatus("SUCCESS");
        return repo.save(payment);
    }

    public List<Payment> getAllPayments() {
        return repo.findAll();
    }
}
