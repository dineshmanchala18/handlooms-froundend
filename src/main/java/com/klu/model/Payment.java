package com.klu.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String method; // UPI, Credit Card, PayPal, Bank

    // Credit Card
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;

    // UPI
    private String upiId;

    // Bank Transfer
    private String accountNumber;
    private String ifscCode;

    // PayPal
    private String paypalEmail;

    private String status;

	public Payment() {
		super();
	}

	public Payment(Long id, Double amount, String method, String cardNumber, String cardHolderName, String expiryDate,
			String cvv, String upiId, String accountNumber, String ifscCode, String paypalEmail, String status) {
		super();
		this.id = id;
		this.amount = amount;
		this.method = method;
		this.cardNumber = cardNumber;
		this.cardHolderName = cardHolderName;
		this.expiryDate = expiryDate;
		this.cvv = cvv;
		this.upiId = upiId;
		this.accountNumber = accountNumber;
		this.ifscCode = ifscCode;
		this.paypalEmail = paypalEmail;
		this.status = status;
	}

	@Override
	public String toString() {
		return "Payment [id=" + id + ", amount=" + amount + ", method=" + method + ", cardNumber=" + cardNumber
				+ ", cardHolderName=" + cardHolderName + ", expiryDate=" + expiryDate + ", cvv=" + cvv + ", upiId="
				+ upiId + ", accountNumber=" + accountNumber + ", ifscCode=" + ifscCode + ", paypalEmail=" + paypalEmail
				+ ", status=" + status + "]";
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getCardNumber() {
		return cardNumber;
	}

	public void setCardNumber(String cardNumber) {
		this.cardNumber = cardNumber;
	}

	public String getCardHolderName() {
		return cardHolderName;
	}

	public void setCardHolderName(String cardHolderName) {
		this.cardHolderName = cardHolderName;
	}

	public String getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(String expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getCvv() {
		return cvv;
	}

	public void setCvv(String cvv) {
		this.cvv = cvv;
	}

	public String getUpiId() {
		return upiId;
	}

	public void setUpiId(String upiId) {
		this.upiId = upiId;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getIfscCode() {
		return ifscCode;
	}

	public void setIfscCode(String ifscCode) {
		this.ifscCode = ifscCode;
	}

	public String getPaypalEmail() {
		return paypalEmail;
	}

	public void setPaypalEmail(String paypalEmail) {
		this.paypalEmail = paypalEmail;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

    

}