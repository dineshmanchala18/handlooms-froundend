package com.klu.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "trible")
public class TribleInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int trible_id;

    private String trible_name;
    private String state;
    private String district;
    private String traditional_skill;
    private long phone_number;

    // Default Constructor
    public TribleInformation() {
    }

    // Parameterized Constructor
    public TribleInformation(int trible_id, String trible_name, String state,
                              String district, String traditional_skill,
                              long phone_number) {

        this.trible_id = trible_id;
        this.trible_name = trible_name;
        this.state = state;
        this.district = district;
        this.traditional_skill = traditional_skill;
        this.phone_number = phone_number;
    }

    // Getters and Setters
    public int getTrible_id() {
        return trible_id;
    }

    public void setTrible_id(int trible_id) {
        this.trible_id = trible_id;
    }

    public String getTrible_name() {
        return trible_name;
    }

    public void setTrible_name(String trible_name) {
        this.trible_name = trible_name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getTraditional_skill() {
        return traditional_skill;
    }

    public void setTraditional_skill(String traditional_skill) {
        this.traditional_skill = traditional_skill;
    }

    public long getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(long phone_number) {
        this.phone_number = phone_number;
    }
}