package com.hiretrack.application;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<ProfileRecord, Long> {
}