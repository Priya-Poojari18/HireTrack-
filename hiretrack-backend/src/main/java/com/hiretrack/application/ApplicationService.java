package com.hiretrack.application;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ApplicationService {

    private static final List<String> ALLOWED_STATUSES =
            List.of("In Review", "Interview", "Offer", "Rejected");

    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository;
    }

    // Get all applications
    public List<ApplicationRecord> findAll() {
        return repository.findAllByOrderByIdDesc();
    }

    // Create a new application
    public ApplicationRecord create(CreateApplicationRequest request) {
        ApplicationRecord record = new ApplicationRecord();

        record.setCompany(request.company().trim());
        record.setRole(request.role().trim());
        record.setInitials(
                request.company().trim().substring(0, 1).toUpperCase()
        );

        return repository.save(record);
    }

    // Edit an existing application
    public ApplicationRecord update(Long id, CreateApplicationRequest request) {

    ApplicationRecord record = repository.findById(id)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Application not found"
                    )
            );

    record.setCompany(request.company().trim());
    record.setRole(request.role().trim());
    record.setInitials(
            request.company().trim().substring(0, 1).toUpperCase()
    );

    if (request.location() != null) {
        record.setLocation(request.location().trim());
    }

    if (request.type() != null) {
        record.setType(request.type().trim());
    }

    if (request.salary() != null) {
        record.setSalary(request.salary().trim());
    }

    if (request.status() != null && !request.status().isBlank()) {
        record.setStatus(request.status());
    }

    if (request.matchScore() != null) {
        record.setMatchScore(request.matchScore());
    }

    return repository.save(record);
}

    // Update application status
    public ApplicationRecord updateStatus(Long id, String status) {

        if (!ALLOWED_STATUSES.contains(status)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status must be In Review, Interview, Offer, or Rejected"
            );
        }

        ApplicationRecord record = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Application not found"
                        )
                );

        record.setStatus(status);

        return repository.save(record);
    }

    // Delete an application
    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Application not found"
            );
        }

        repository.deleteById(id);
    }
// Get dashboard statistics
public ApplicationStats getStats() {

    long total = repository.count();

    long inReview = repository.countByStatus("In Review");

    long interviews = repository.countByStatus("Interview");

    long offers = repository.countByStatus("Offer");

    long rejected = repository.countByStatus("Rejected");

    return new ApplicationStats(
            total,
            inReview,
            interviews,
            offers,
            rejected
    );
}
}   