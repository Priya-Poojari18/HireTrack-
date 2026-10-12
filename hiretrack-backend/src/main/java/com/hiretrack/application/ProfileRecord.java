package com.hiretrack.application;

import jakarta.persistence.*;

@Entity
@Table(name = "profile")
public class ProfileRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String careerInterest;
    private String preferredJobType;

    public ProfileRecord() {
    }

    public ProfileRecord(
            String name,
            String careerInterest,
            String preferredJobType
    ) {
        this.name = name;
        this.careerInterest = careerInterest;
        this.preferredJobType = preferredJobType;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCareerInterest() {
        return careerInterest;
    }

    public void setCareerInterest(String careerInterest) {
        this.careerInterest = careerInterest;
    }

    public String getPreferredJobType() {
        return preferredJobType;
    }

    public void setPreferredJobType(String preferredJobType) {
        this.preferredJobType = preferredJobType;
    }
}