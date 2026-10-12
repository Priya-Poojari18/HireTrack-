package com.hiretrack.application;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(
    origins = "http://localhost:5173",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.PATCH,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    // GET - Get all applications
    @GetMapping
    public List<ApplicationRecord> getAll() {
        return service.findAll();
    }

    // POST - Create a new application
    @PostMapping
    public ApplicationRecord create(
            @RequestBody CreateApplicationRequest request) {
        return service.create(request);
    }

    // PUT - Edit company and role
    @PutMapping("/{id}")
    public ApplicationRecord update(
            @PathVariable Long id,
            @RequestBody CreateApplicationRequest request) {
        return service.update(id, request);
    }

    // PATCH - Update application status
    @PatchMapping("/{id}/status")
    public ApplicationRecord updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        return service.updateStatus(id, status);
    }

    // DELETE - Delete application
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    
@GetMapping("/stats")
public ApplicationStats getStats() {
    return service.getStats();
}

}
