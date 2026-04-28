package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.Payment;
import com.klu.service.PaymentService;

@RestController
@RequestMapping("/payment")
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app" }, allowedHeaders = "*")
public class Paymentcontroller {
	@Autowired
	private PaymentService py;
	@GetMapping
	public List<Payment> getPayments() {
		return py.getAllPayments();
	}

	@PostMapping("/make")
	public Payment makePayment(@RequestBody Payment p) {
		return py.processPayment(p);
		
	}

}
