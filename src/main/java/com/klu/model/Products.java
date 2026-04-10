package com.klu.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productname;   
    private int price;
    private int Quantity;

    public Products(Long id, String productname, int price, int quantity) {
		super();
		this.id = id;
		this.productname = productname;
		this.price = price;
		Quantity = quantity;
	}

	// Default constructor (Required)
    public Products() {}

    

    // Getters and Setters

    public int getQuantity() {
		return Quantity;
	}

	public void setQuantity(int quantity) {
		Quantity = quantity;
	}

	public Long getId() {
        return id;
    }

    public String getProductname() {
        return productname;
    }

    public void setProductname(String productname) {
        this.productname = productname;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}