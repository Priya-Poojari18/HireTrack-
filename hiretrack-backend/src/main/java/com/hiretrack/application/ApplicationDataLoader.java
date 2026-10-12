package com.hiretrack.application;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!prod")
public class ApplicationDataLoader {
    @Bean
    CommandLineRunner seedApplications(ApplicationRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.save(make("Atlassian", "Software Engineer Intern", "Bengaluru, India", "Interview", 94));
            repository.save(make("Razorpay", "Java Backend Developer", "Bengaluru, India", "In Review", 89));
            repository.save(make("Freshworks", "Associate Software Engineer", "Hybrid · Bengaluru", "In Review", 86));
            repository.save(make("Zoho", "Full Stack Developer", "Chennai, India", "Offer", 82));
            repository.save(make("Walmart Global Tech", "Graduate Engineer Trainee", "Bengaluru, India", "Rejected", 78));
        };
    }

    private ApplicationRecord make(String company, String role, String location, String status, int match) {
        ApplicationRecord a = new ApplicationRecord();
        a.setCompany(company);
        a.setRole(role);
        a.setLocation(location);
        a.setStatus(status);
        a.setMatchScore(match);
        a.setInitials(company.substring(0, 1));
        return a;
    }
}
