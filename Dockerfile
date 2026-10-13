
# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

COPY hiretrack-frontend/package*.json ./
RUN npm install

COPY hiretrack-frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot backend
FROM maven:3.9-eclipse-temurin-25 AS backend-build
WORKDIR /app

COPY hiretrack-backend/pom.xml .
COPY hiretrack-backend/src ./src

# Copy the built React files into Spring Boot's static folder
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests

# Stage 3: Run the entire application
FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
