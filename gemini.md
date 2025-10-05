# Gemini Project Overview: Gocashless

This document outlines my understanding of the Gocashless project, its goals, architecture, and our progress as of my last update. As a final year student, this project represents the culmination of my studies, and I have been the sole developer working on it.

## 1. Project Vision

The primary goal of the Gocashless project is to modernize the payment system for public transportation in Zambia. It aims to replace cash transactions with a seamless digital payment solution using QR codes and mobile money, specifically targeting the Airtel Money platform.

## 2. System Architecture

The system is designed as a microservices-based architecture with a clear separation between backend services and frontend applications.

### Tech Stack

- **Backend:** Java with Spring Boot & Spring Cloud
- **Frontend (Web):** Next.js (JavaScript) with Tailwind CSS
- **Frontend (Mobile):** React Native (planned)
- **Databases:** PostgreSQL

### Backend Services

The backend consists of several independent microservices:

- **`user-management-service`**: Handles registration, authentication (via JWT), and profile management for all user roles (Passengers, Conductors, Bus Companies, Admins).
- **`route-fare-management-service`**: Manages the creation and storage of bus routes, stops, and their corresponding fares.
- **`qr-code-generation-service`**: Generates QR codes based on route and fare data provided by a conductor's app.
- **`payment-service` (Planned)**: Will handle the integration with the MTN Mobile Money API, process payments, and record transactions.
- **`notification-service` (Planned)**: Will provide real-time payment confirmation notifications to the conductor's app.
- **API Gateway & Eureka Server (Planned)**: Essential components for service discovery and routing in a microservices architecture.

### Frontend Applications

- **`gocashless-web`**: A Next.js web application for Bus Company owners to register, manage their routes and conductors, and view transaction dashboards.
- **Conductor App (React Native, Planned)**: A mobile app for conductors to generate QR codes for passengers.
- **Passenger App (React Native, Planned)**: A mobile app for passengers to scan QR codes and authorize payments.

## 3. Current Status & Progress

- **Backend**:
  - The foundational services (`user-management`, `route-fare-management`, `qr-code-generation`) have been created and their dependencies are defined.
  - A new `eureka` service has been added to the project.
  - All existing backend services (`user-management-service`, `route-fare-management-service`, `qr-code-generation-service`) have been configured to register with the Eureka server by:
    - Adding the `spring-cloud-starter-netflix-eureka-client` dependency to their `pom.xml` files.
    - Configuring `eureka.client.serviceUrl.defaultZone` in their `application.yml` files.
    - Adding/updating the `@EnableEurekaClient` annotation in their main application classes.
  - **`payment-processing-service`**:
    - The service has been scaffolded with a full project structure.
    - DTOs for handling requests and responses with the Airtel Money API have been created.
    - The `AirtelService` has been implemented to handle the authentication and payment initiation flows with the Airtel Money API.
    - The `PaymentService` has been implemented to orchestrate the payment process.
    - The `Transaction` entity has been updated to store comprehensive transaction details.
- **Frontend**:
  - The Next.js web application (`gocashless-web`) has been set up with a proper file structure.
  - We have built the UI for the login page and the registration page for the Bus Company dashboard.
  - The registration page is now connected to the `user-management-service` backend.
  - A CORS issue between the frontend and backend was identified and resolved by adding `@CrossOrigin` to the `UserController`.
  - The frontend's API client (`apiClient.js`) was temporarily configured to directly connect to the `user-management-service` (`http://localhost:7000`) for development and testing purposes.
  - The home page for the `gocashless-web` application has been created using the `HOME_PAGE_MOCK.html` as a template.
  - The CSS from the mock HTML has been integrated into `src/app/globals.css`.
  - The "Login / Register" and "Get Started" buttons on the home page are now connected to the `/login` route.
- **`mobile-app-conductor`**:
  - Implemented the core QR code generation feature, connecting the frontend to the `user-management`, `route-fare-management`, and `qr-code-generation` services.
  - Secured the application by removing the public sign-up flow, ensuring only pre-registered conductors can log in.
  - Built a modern, data-driven UI for the home screen, allowing conductors to select a route and stops.
  - Created a reusable `SelectionModal` for picking from lists of data.
  - Created a `QrCodeModal` to display the generated QR code.
  - Established a (temporary) direct-call API client pattern for communicating with backend microservices.
  - Refactored the API clients to use a centralized configuration, removing hardcoded IP addresses and improving maintainability.
- **Backend (`user-management-service`)**:
  - To support the mobile app, a secure `GET /api/v1/users/me` endpoint was created.
  - This involved adding a `clerkId` field to the `User` entity to link it to the Clerk authentication provider.
  - The `UserRepository`, `UserService`, and `UserController` were all updated to support fetching a user by their `clerkId`.
- **`todo.txt`**: A high-level project roadmap has been created and saved in the root directory.
- **Admin Dashboard (`gocashless-web`)**:
  - Refactored the dashboard to use a new, consistent layout with a collapsible sidebar and header.
  - Enhanced the **Routes** page with search functionality and added an `isActive` toggle to the create/edit forms.
  - Created a global **Bus Stops** page (`/dashboard/bus-stops`) with full CRUD functionality.
  - Created a global **Fares** page (`/dashboard/fares`) with full CRUD functionality.
  - **Fixed a major bug** in the bus stop update functionality by:
    - Correcting the backend DTO (`BusStopResponse`) to include the `orderInRoute`.
    - Fixing a JSON serialization error in the backend controller.
    - Implementing robust frontend validation to prevent invalid route ordering.
  - Added full CRUD endpoints for Fares to the `route-fare-management-service` backend.

This file serves as a living document of our collaboration. I will refer to it to maintain context in our future sessions.

## 4. Planned Refactoring

- **`user-management-service` Cleanup**: As part of the migration to Clerk for authentication, a full cleanup of the `user-management-service` is planned.
  - [ ] Remove the `passwordHash` field from the `User` entity.
  - [ ] Remove the obsolete `/register/*` endpoints from the `UserController`.
  - [ ] Remove all password-handling logic from the `UserService`.
  - [ ] Implement a Clerk Webhook handler to create users in the local database automatically after they sign up via a trusted frontend (like the web dashboard). This will replace the manual registration endpoints.
  - [ ] **API Gateway**: Create a dedicated Spring Cloud API Gateway service. This will serve as the single entry point for all frontend requests, routing them to the appropriate microservices via Eureka. This will replace the temporary direct-to-service API calls from the mobile app.
- **Single Company Migration**: The project scope has been updated to a single-company model where GoCashless is the sole operator.
  - [ ] Remove all UI and backend logic related to multi-tenant bus companies.
  - [ ] Remove the `busCompanyId` field from the `User` entity and related DTOs.
  - [ ] Simplify the conductor management to assume all conductors belong to GoCashless.
  - [ ] Remove the bus company registration flow.