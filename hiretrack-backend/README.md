# HireTrack Backend

Spring Boot REST API for the HireTrack job application tracker.

## Technologies Used
- Java
- Spring Boot
- Maven
- Spring Data JPA
- H2 Database

## Requirements
- Java version compatible with the project configuration
- Maven 3.9 or later

## Run Locally

From the `hiretrack-backend` directory, run:

```powershell
& ..\apache-maven-3.9.16\bin\mvn.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Add an application |
| PUT | `/api/applications/{id}` | Update an application |
| PATCH | `/api/applications/{id}/status` | Update application status |
| DELETE | `/api/applications/{id}` | Delete an application |
| GET | `/api/applications/stats` | Get dashboard statistics |
| GET | `/api/profile` | Get the user profile |
| PUT | `/api/profile` | Update the user profile |

## Application Statuses
- In Review
- Interview
- Offer
- Rejected

## Database
The project uses H2 Database with Spring Data JPA to store application and profile information.

## Author
Priya Poojari
