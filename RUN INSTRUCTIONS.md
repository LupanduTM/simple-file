# Project Gocashless: Setup and Running Instructions

This document provides instructions on how to set up and run the Gocashless project on your local machine.

## 1. Prerequisites

Before you begin, ensure you have the following installed:

*   **Java Development Kit (JDK):**
    *   JDK 21 for the main microservices.
    *   JDK 17 for `fake-pay` and `notification-service`.
    *   It's recommended to use a tool like `jenv` or `SDKMAN` to manage multiple Java versions.
*   **Node.js:** A recent version of Node.js (LTS recommended) for the frontend applications.
*   **Maven:** Apache Maven for building and running the backend services.
*   **PostgreSQL:** A running instance of PostgreSQL for the services that require a database.

## 2. Backend Services

All backend services are Spring Boot applications and can be built and run using Maven.

### Build

To build a service, navigate to its root directory and run:

```bash
mvn clean install
```

### Run

To run a service, navigate to its root directory and run:

```bash
mvn spring-boot:run
```

### Services

Here's a list of the backend services:

*   `eureka`: Service discovery and registry.
*   `api-gateway`: Single entry point for all frontend requests.
*   `user-management-service`: Handles user registration, authentication, and profile management. (Requires PostgreSQL)
*   `route-fare-management-service`: Manages bus routes, stops, and fares. (Requires PostgreSQL)
*   `qr-code-generation-service`: Generates QR codes.
*   `transaction-history-service`: Provides transaction history. (Requires PostgreSQL)
*   `notification-service`: Handles notifications.
    *   **Note:** You must provide your own email and password in the `application.yml` file (`src/main/resources/application.yml`) for this service to work correctly. Update the `spring.mail.username` and `spring.mail.password` properties.
*   `fake-pay`: A mock payment service.

## 3. Frontend Applications

The project includes a web application and two mobile applications.

### Web Application (`gocashless-web`)

The web application is a Next.js project.

1.  **Navigate to the directory:**
    ```bash
    cd gocashless-web
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

### Mobile Applications (`mobile-app-conductor` and `mobile-app-passenger`)

The mobile applications are React Native projects built with Expo.

1.  **Navigate to the directory:**
    ```bash
    cd mobile-app-conductor
    # or
    cd mobile-app-passenger
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Expo bundler:**
    ```bash
    npx expo start
    ```

This will open the Expo developer tools in your browser. You can then run the app on an Android or iOS simulator/device.

## 5. Testing

### Backend Services

To run the tests for a backend service, navigate to its root directory and run:

```bash
mvn test
```

This will run all the unit and integration tests for the service.


## 4. Running the Entire Project

To run the entire project, follow these steps in order:

1.  **Start PostgreSQL:** Make sure your PostgreSQL server is running.
2.  **Start Eureka Server:**
    ```bash
    cd eureka
    mvn spring-boot:run
    ```
3.  **Start the other backend services:** Start the following services in any order. It's recommended to run each in a separate terminal.
    *   `api-gateway`
    *   `user-management-service`
    *   `route-fare-management-service`
    *   `qr-code-generation-service`
    *   `transaction-history-service`
    *   `notification-service`
    *   `fake-pay`
4.  **Start the frontend applications:**
    *   `gocashless-web`
    *   `mobile-app-conductor`
    *   `mobile-app-passenger`

Once all the services and applications are running, you can access the web dashboard and use the mobile apps.
