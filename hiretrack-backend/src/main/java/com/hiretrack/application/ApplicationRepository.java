package com.hiretrack.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<ApplicationRecord, Long> {

    // Get all applications, newest first
    List<ApplicationRecord> findAllByOrderByIdDesc();

    // Count applications with a particular status
    long countByStatus(String status);

    // Count applications having any of the given statuses
    long countByStatusIn(List<String> statuses);
}