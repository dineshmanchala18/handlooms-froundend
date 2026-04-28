package com.klu.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productname;   
    private String category;
    private String artisan;
    @Column(length = 1000)
    private String image;
    @Column(length = 1000)
    private String description;
    @Column(length = 1000)
    private String culturalNotes;
    private Double price;
    private int Quantity;
    private Double rating = 0.0;

    public Products(Long id, String productname, Double price, int quantity) {
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getArtisan() {
        return artisan;
    }

    public void setArtisan(String artisan) {
        this.artisan = artisan;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCulturalNotes() {
        return culturalNotes;
    }

    public void setCulturalNotes(String culturalNotes) {
        this.culturalNotes = culturalNotes;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}
