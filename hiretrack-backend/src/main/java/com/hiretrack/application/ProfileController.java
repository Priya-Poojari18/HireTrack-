package com.hiretrack.application;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileRepository repository;

    public ProfileController(ProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ProfileRecord getProfile() {

        if (repository.count() == 0) {
            ProfileRecord profile = new ProfileRecord(
                    "Priya Poojari",
                    "Software Development",
                    "Full-time"
            );

            return repository.save(profile);
        }

        return repository.findAll().get(0);
    }

    @PutMapping
    public ProfileRecord updateProfile(@RequestBody ProfileRecord request) {

        ProfileRecord profile;

        if (repository.count() == 0) {
            profile = new ProfileRecord();
        } else {
            profile = repository.findAll().get(0);
        }

        profile.setName(request.getName());
        profile.setCareerInterest(request.getCareerInterest());
        profile.setPreferredJobType(request.getPreferredJobType());

        return repository.save(profile);
    }
}