package com.hiretrack.application;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "job_applications")
public class ApplicationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String company;

    @NotBlank
    @Column(nullable = false)
    private String role;

    private String initials;
    private String color = "violet";
    private String location = "Not specified";
    private String type = "Full-time";
    private String salary = "Not specified";
    private String posted = "Just now";

    @Column(nullable = false)
    private String status = "In Review";

    @Min(0)
    @Max(100)
    private Integer matchScore = 75;

    public ApplicationRecord() {}

    @PrePersist
    void setDefaults() {
        if (initials == null || initials.isBlank()) initials = company.substring(0, 1).toUpperCase();
        if (color == null || color.isBlank()) color = "violet";
        if (location == null || location.isBlank()) location = "Not specified";
        if (type == null || type.isBlank()) type = "Full-time";
        if (salary == null || salary.isBlank()) salary = "Not specified";
        if (posted == null || posted.isBlank()) posted = "Just now";
        if (status == null || status.isBlank()) status = "In Review";
        if (matchScore == null) matchScore = 75;
    }

    public Long getId() { return id; }
    public String getCompany() { return company; }
    public String getInitials() { return initials; }
    public String getColor() { return color; }
    public String getRole() { return role; }
    public String getLocation() { return location; }
    public String getType() { return type; }
    public String getSalary() { return salary; }
    public String getPosted() { return posted; }
    public String getStatus() { return status; }
    public Integer getMatch() { return matchScore; }

    public void setCompany(String company) { this.company = company; }
    public void setRole(String role) { this.role = role; }
    public void setInitials(String initials) { this.initials = initials; }
    public void setColor(String color) { this.color = color; }
    public void setLocation(String location) { this.location = location; }
    public void setType(String type) { this.type = type; }
    public void setSalary(String salary) { this.salary = salary; }
    public void setPosted(String posted) { this.posted = posted; }
    public void setStatus(String status) { this.status = status; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }
}
