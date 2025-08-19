# Gemini Project Overview: Gocashless

This document outlines my understanding of the Gocashless project, its goals, architecture, and our progress as of my last update.

## 1. Project Vision

The primary goal of the Gocashless project is to modernize the payment system for public transportation in Zambia. It aims to replace cash transactions with a seamless digital payment solution using QR codes and mobile money, specifically targeting the MTN Mobile Money platform.

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

- **Backend**: The foundational services (`user-management`, `route-fare-management`, `qr-code-generation`) have been created and their dependencies are defined.
- **Frontend**: The Next.js web application (`gocashless-web`) has been set up with a proper file structure.
  - We have built the UI for the login page and the registration page for the Bus Company dashboard.
  - The registration page is now connected to the `user-management-service` backend.
  - A CORS issue between the frontend and backend was identified and resolved by adding `@CrossOrigin` to the `UserController`.
  - The frontend's API client (`apiClient.js`) was temporarily configured to directly connect to the `user-management-service` (`http://localhost:7000`) for development and testing purposes.
- **`todo.txt`**: A high-level project roadmap has been created and saved in the root directory.

This file serves as a living document of our collaboration. I will refer to it to maintain context in our future sessions.
