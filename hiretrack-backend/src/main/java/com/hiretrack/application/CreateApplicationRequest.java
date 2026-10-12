package com.hiretrack.application;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateApplicationRequest(
    @NotBlank(message = "Company is required")
    String company,

    @NotBlank(message = "Job title is required")
    String role,

    String location,

    String type,

    String salary,

    String status,

    @Min(0)
    @Max(100)
    Integer matchScore
) {}