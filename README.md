# User Management Service

Spring Boot microservice that handles account lifecycle, credential management, and role-scoped access control for the GoCashless platform. It exposes REST APIs for registration, profile management, and administrative actions while delegating notification delivery to a dedicated service.

## Features

- Session-backed authentication with Spring Security and role-based endpoint guards.
- CRUD operations for passengers, conductors, and GoCashless admins.
- Automated temporary credential issuance for conductors plus welcome/password reset notifications via Feign.
- PostgreSQL persistence with JPA/Hibernate and automatic timestamp auditing.
- Service discovery registration through Netflix Eureka.

## Architecture

| Layer | Implementation | Notes |
| ----- | -------------- | ----- |
| HTTP/API | `AuthController`, `UserController` | Exposes `/api/v1/auth` and `/api/v1/users` routes. |
| Service | `UserService` | Encapsulates registration, updates, status transitions, and password policies. |
| Persistence | `UserRepository` | Spring Data JPA repository against `users` table. |
| Domain | `User`, `Role`, `UserStatus` | Implements `UserDetails` for security integration. |
| Integration | `NotificationServiceClient` | Feign client targeting `notification-service`. |
| Config | `SecurityConfig`, `application.yml` | Role guard rules, session strategy, port 7000, PostgreSQL/Eureka settings. |

## Prerequisites

- JDK 21+
- Maven 3.9+ (or use the bundled `mvnw`/`mvnw.cmd`)
- PostgreSQL 14+ with a database named `gocashless_ums_db`
- Running Eureka server at `http://localhost:8761/eureka`
- Optional: Notification Service registered with Eureka

## Configuration

Default settings live in `src/main/resources/application.yml` and can be overridden via environment variables or JVM properties.

| Purpose | Property | Default |
| ------- | -------- | ------- |
| Server port | `SERVER_PORT` | `7000` |
| Service name | `SPRING_APPLICATION_NAME` | `user-management-service` |
| Eureka discovery | `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://localhost:8761/eureka` |
| JDBC URL | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/gocashless_ums_db` |
| DB credentials | `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | `postgres` / `123456789` |
| Hibernate DDL mode | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |

> **Security**: CSRF is disabled for API convenience. Authentication is session-based—clients must retain the returned `JSESSIONID` cookie. Endpoints are protected by role-specific `@PreAuthorize` checks and matcher rules.

## Running Locally

```bash
# Install dependencies and run (Unix)
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw.cmd spring-boot:run
```
### API Reference

#### Authentication

| Method | Path | Description | Auth |
|--------|------|--------------|------|
| **POST** | `/api/v1/auth/login` | Authenticates via email/password, creates session. Optionally pass `X-Client-App` (`PASSENGER_MOBILE`, `CONDUCTOR_MOBILE`, `ADMIN_WEB_DASHBOARD`) to enforce channel-role alignment. | Public |

### Self-Service Endpoints (Authenticated User)

| Method | Path | Description |
|--------|------|--------------|
| **GET** | `/api/v1/users/me` | Retrieve own profile. |
| **PUT** | `/api/v1/users/me` | Update profile fields (email, phone, names). |
| **DELETE** | `/api/v1/users/me` | Delete own account. |

---

### Registration

| Method | Path | Role Requirement | Notes |
|--------|------|------------------|-------|
| **POST** | `/api/v1/users/register/passenger` | Public | Requires password; triggers passenger welcome email. |
| **POST** | `/api/v1/users/register/conductor` | ROLE_GOCASHLESS_ADMIN | Issues random temporary password emailed via notification service. |
| **POST** | `/api/v1/users/register/admin` | ROLE_GOCASHLESS_ADMIN (enforced by matcher) | Direct admin creation. |

### Administrative & Management Endpoints

| Method | Path | Required Role | Purpose |
|--------|------|----------------|----------|
| **GET** | `/api/v1/users/admins` | ROLE_GOCASHLESS_ADMIN | List admins. |
| **GET** | `/api/v1/users/conductors` | ROLE_GOCASHLESS_ADMIN | List conductors. |
| **GET** | `/api/v1/users/passengers` | ROLE_GOCASHLESS_ADMIN | List passengers. |
| **GET** | `/api/v1/users/{id}` | Public | Lookup by ID (used by other services). |
| **GET** | `/api/v1/users/email/{email}` | Authenticated | Lookup by email. |
| **PUT** | `/api/v1/users/update/{id}` | Authenticated | Update user metadata. |
| **PUT** | `/api/v1/users/{id}/status` | ROLE_GOCASHLESS_ADMIN | Set `ACTIVE`, `INACTIVE`, or `BLOCKED`. |
| **POST** | `/api/v1/users/{id}/reset-password` | ROLE_GOCASHLESS_ADMIN | Generates temporary password and emails user. |
| **PUT** | `/api/v1/users/{id}/password` | Authenticated | Force-set password (no old password check). |
| **DELETE** | `/api/v1/users/{id}` | ROLE_GOCASHLESS_ADMIN | Hard delete user. |

### Notifications

- **Conductor credential emails:** `/send-credentials`
- **Passenger welcome email:** `/send-passenger-welcome`
- **Password reset email:** `/send-password-reset`

All are issued through the **notification-service** (discovered via **Eureka**).  
Ensure that the service is registered and reachable, or mock it during local development.

---

# Route Fare Management Service

Spring Boot microservice that curates transit routes, stop topology, and fare schedules for the GoCashless platform. It exposes REST endpoints for CRUD workflows across routes, stops, and fares so that operations teams and downstream services can keep pricing in sync.

## Features

- Centralised route catalogue with activation toggles and metadata (`RouteService` in `src/main/java/com/gocashless/rfms/service/RouteService.java:25`).
- Ordered stop management per route, including geolocation metadata (`BusStopService` in `src/main/java/com/gocashless/rfms/service/BusStopService.java:29`).
- Time-aware fare definitions with route/stop pairing and currency support (`FareService` in `src/main/java/com/gocashless/rfms/service/FareService.java:34`).
- PostgreSQL persistence via Spring Data JPA repositories in `src/main/java/com/gocashless/rfms/repository`.
- Service discovery integration using Netflix Eureka (`src/main/resources/application.yml:4`).

## Architecture

| Layer | Implementation | Notes |
| ----- | -------------- | ----- |
| HTTP/API | `RouteController`, `BusStopController`, `FareController` (`src/main/java/com/gocashless/rfms/controller`) | REST endpoints under `/api/v1/routes`, `/api/v1/bus-stops`, `/api/v1/fares`. |
| Service | `RouteService`, `BusStopService`, `FareService` | Validates input, enforces relationships, maps entities to DTOs. |
| Persistence | `RouteRepository`, `BusStopRepository`, `FareRepository` | JPA repositories targeting PostgreSQL tables. |
| Domain | `Route`, `BusStop`, `Fare` (`src/main/java/com/gocashless/rfms/model`) | UUID identifiers, audit timestamps, lazy associations. |
| Config | `application.yml` | Port 7001, PostgreSQL credentials, Eureka client. |

## Prerequisites

- JDK 21+
- Maven 3.9+ (or use the included `mvnw` / `mvnw.cmd`)
- PostgreSQL 14+ with a database named `gocashless_rfms_db`
- Running Eureka server at `http://localhost:8761/eureka`

## Configuration

Default properties live in `src/main/resources/application.yml` and can be overridden through environment variables or JVM args.

| Purpose | Property | Default |
| ------- | -------- | ------- |
| Server port | `SERVER_PORT` | `7001` |
| Service name | `SPRING_APPLICATION_NAME` | `route-fare-management-service` |
| Eureka discovery | `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://localhost:8761/eureka` |
| JDBC URL | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/gocashless_rfms_db` |
| DB credentials | `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | `postgres` / `123456789` |
| Hibernate DDL mode | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| SQL logging | `SPRING_JPA_SHOW_SQL` | `true` |

> **CORS**: Controllers are annotated with `@CrossOrigin(origins = "http://localhost:3000")`, enabling local admin/front-end tooling without a proxy.

## Running Locally

```bash
#### Unix/macOS
./mvnw spring-boot:run

#### Windows PowerShell
.\mvnw.cmd spring-boot:run
```
### Override database credentials as needed

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/rfms_dev \
SPRING_DATASOURCE_USERNAME=rfms_app \
SPRING_DATASOURCE_PASSWORD=topsecret \
./mvnw spring-boot:run
```
### API Reference
### Routes

| Method | Path | Description |
|--------|------|--------------|
| **POST** | `/api/v1/routes` | Create a route (`RouteRequest`). |
| **GET** | `/api/v1/routes` | List all routes (`RouteResponse`). |
| **GET** | `/api/v1/routes/{id}` | Fetch a route by UUID. |
| **PUT** | `/api/v1/routes/{id}` | Update name, description, or active flag. |
| **DELETE** | `/api/v1/routes/{id}` | Remove a route. |

### Bus Stops

| Method | Path | Description |
|--------|------|--------------|
| **POST** | `/api/v1/bus-stops` | Create a bus stop and optionally link to a route (`BusStopRequest`). |
| **GET** | `/api/v1/bus-stops` | List all stops with route metadata (`BusStopResponse`). |
| **GET** | `/api/v1/bus-stops/{id}` | Fetch a stop by UUID. |
| **GET** | `/api/v1/bus-stops/by-route/{routeId}` | Ordered stops for a specific route. |
| **PUT** | `/api/v1/bus-stops/{id}` | Update stop details and route association. |
| **DELETE** | `/api/v1/bus-stops/{id}` | Delete a stop. |


### Fares

| Method | Path | Description |
|--------|------|--------------|
| **POST** | `/api/v1/fares` | Create a fare linking route, origin, and destination stops (`FareRequest`). |
| **GET** | `/api/v1/fares` | List all fares (`FareResponse`). |
| **GET** | `/api/v1/fares/{id}` | Retrieve fare by UUID. |
| **PUT** | `/api/v1/fares/{id}` | Update fare metadata and validity window. |
| **DELETE** | `/api/v1/fares/{id}` | Delete a fare. |
| **GET** | `/api/v1/fares/lookup?routeId=&originStopId=&destinationStopId=` | Resolve the most recent fare for a journey combination. |

---

# Transaction History Service

Spring Boot microservice that records every cashless journey event, enriches transactions with user and route context, and surfaces analytics for the GoCashless platform. It exposes REST APIs for capturing transactions, querying history, and generating dashboard KPIs.

## Features

- Transaction ingestion with defaults for status/timestamp and currency validation (`TransactionService` at `src/main/java/com/gocashless/ths/service/TransactionService.java`).
- Cross-service enrichment via OpenFeign clients to User Management and Route/Fare services for route, stop, and user metadata (`src/main/java/com/gocashless/ths/client`).
- Dashboard metrics (KPIs, trend lines, breakdowns) powered by custom JPA queries (`DashboardService` at `src/main/java/com/gocashless/ths/service/DashboardService.java`).
- PostgreSQL persistence using Spring Data JPA repositories (`TransactionRepository` under `src/main/java/com/gocashless/ths/repository`).
- Netflix Eureka discovery and service registration (`src/main/resources/application.yml`).

## Architecture

| Layer | Implementation | Notes |
| ----- | -------------- | ----- |
| HTTP/API | `TransactionController` | Routes under `/api/v1/transactions`, CORS opened for all origins. |
| Service | `TransactionService`, `DashboardService` | Handles persistence, enrichment, and reporting logic. |
| Persistence | `TransactionRepository` | Includes query methods for history and analytics aggregations. |
| Domain | `Transaction`, `TransactionStatus`, `TransactionType` | UUID identifiers, audit timestamps, enum-driven lifecycle. |
| Integration | `UmsServiceClient`, `RfmsServiceClient` | Feign clients for UMS and RFMS lookups. |
| Config | `application.yml` | Port 7004, PostgreSQL, Eureka registration. |

## Prerequisites

- JDK 21+
- Maven 3.9+ (or the bundled `mvnw` / `mvnw.cmd`)
- PostgreSQL 14+ with a database named `gocashless_ths_db`
- Running Eureka server at `http://localhost:8761/eureka`
- User Management and Route/Fare Management services available for enrichment (optional but recommended)

## Configuration

Values in `src/main/resources/application.yml` can be overridden using environment variables or JVM system properties.

| Purpose | Property | Default |
| ------- | -------- | ------- |
| Server port | `SERVER_PORT` | `7004` |
| Service name | `SPRING_APPLICATION_NAME` | `transaction-history-service` |
| JDBC URL | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/gocashless_ths_db` |
| DB credentials | `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | `postgres` / `123456789` |
| Hibernate DDL mode | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| SQL logging | `SPRING_JPA_SHOW_SQL` | `true` |
| Eureka zone | `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://localhost:8761/eureka` |

## Running Locally

``` bash
# Unix/macOS
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw.cmd spring-boot:run
```
### API Reference

#### Transaction APIs

| Method | Path | Description |
|--------|------|--------------|
| **GET** | `/api/v1/transactions` | List all transactions (most recent first). |
| **POST** | `/api/v1/transactions` | Create a transaction (`TransactionRequest`); defaults status to `COMPLETED` and timestamp to now when omitted. |
| **GET** | `/api/v1/transactions/{id}` | Retrieve a transaction by UUID with enriched names. |
| **GET** | `/api/v1/transactions/user/{userId}` | Fetch transactions for a passenger, newest first. |
| **GET** | `/api/v1/transactions/conductor/{conductorId}` | Fetch transactions handled by a conductor. |
| **GET** | `/api/v1/transactions/search?startDate=&endDate=` | Filter transactions by ISO-8601 datetime range (e.g., `2025-10-01T00:00:00`). |

### Analytics APIs

| Method | Path | Description |
|--------|------|--------------|
| **GET** | `/api/v1/transactions/stats/kpis` | Total revenue (completed transactions) and transaction count. |
| **GET** | `/api/v1/transactions/stats/over-time` | Daily aggregates with transaction count and amount. |
| **GET** | `/api/v1/transactions/stats/by-status` | Transaction count grouped by status. |
| **GET** | `/api/v1/transactions/stats/by-type` | Transaction count grouped by type. |
| **GET** | `/api/v1/transactions/stats/top-routes` | Completed transaction revenue per route, descending. |
| **GET** | `/api/v1/transactions/stats/top-conductors` | Completed transaction revenue per conductor, descending. |

---

# QR Code Generation Service

Spring Boot microservice that assembles journey-specific payment payloads, encrypts them, and renders QR codes for the GoCashless platform. It exposes a single REST endpoint that jukes across supporting services to gather fare, route, and conductor metadata before returning a Base64 PNG.

## Features

- QR generation endpoint that orchestrates fare lookup, conductor lookup, payload encryption, and image rendering (`QrCodeService` in `src/main/java/com/gocashless/qrgs/service/QrCodeService.java`).
- Inter-service communication via a load-balanced `RestTemplate`, allowing Eureka-discovered service names (`AppConfig` in `src/main/java/com/gocashless/qrgs/config/AppConfig.java`).
- Configurable QR output (size/format/charset) and encryption key through externalized properties (`src/main/resources/application.yml`).
- ZXing-powered QR encoding (`QrCodeGenerator` at `src/main/java/com/gocashless/qrgs/util/QrCodeGenerator.java`).

## Architecture

| Layer | Implementation | Notes |
| ----- | -------------- | ----- |
| HTTP/API | `QrCodeController` | POST `/api/v1/qr/generate` receives `QrGenerateRequest`. |
| Service | `QrCodeService` | Calls RFMS and UMS, builds payload, encrypts, and produces image. |
| Integration | `RestTemplate` (`@LoadBalanced`) | Targets Eureka services `ROUTE-FARE-MANAGEMENT-SERVICE` and `USER-MANAGEMENT-SERVICE`. |
| Utilities | `QrCodeGenerator`, `EncryptionService` | ZXing encoder and JSON-based crypto abstraction. |
| Config | `application.yml` | Port 7002, QR tuning knobs, encryption secret, Eureka settings. |

## Prerequisites

- JDK 21+
- Maven 3.9+ (or bundled `mvnw`/`mvnw.cmd`)
- Eureka server at `http://localhost:8761/eureka`
- Route Fare Management and User Management services running (for live fare/conductor data)

## Configuration

Default properties live in `src/main/resources/application.yml`. Override via environment variables or JVM args as needed.

| Purpose | Property | Default |
| ------- | -------- | ------- |
| Server port | `SERVER_PORT` | `7002` |
| Service name | `SPRING_APPLICATION_NAME` | `qr-code-generation-service` |
| Eureka zone | `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://localhost:8761/eureka` |
| QR width | `QRCODE_WIDTH` | `300` |
| QR height | `QRCODE_HEIGHT` | `300` |
| QR format | `QRCODE_FORMAT` | `PNG` |
| QR charset | `QRCODE_CHARSET` | `UTF-8` |
| Encryption secret | `QR_ENCRYPTION_SECRET-KEY` | `aVerySimpleTestSecretKeyForQrEncryption` |

> **Security note**: The bundled `EncryptionService` currently returns JSON plaintext (encryption commented out). Reinstate AES logic and manage keys via a vault before production use.

## Running Locally

``` bash
# Unix/macOS
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw.cmd spring-boot:run
```

### API Reference

| Method | Path | Description | Payload | Response |
|--------|------|--------------|----------|-----------|
| **POST** | `/api/v1/qr/generate` | Generates a payment QR for a conductor/route/stop combination. | `QrGenerateRequest` JSON containing `conductorId`, `routeId`, `originStopId`, `destinationStopId`. | `QrGenerateResponse` with Base64 `qrCodeImageBase64`, `transactionRef`, and `message`. |

### Payload Construction

1. **Fare lookup:**  
   `GET http://ROUTE-FARE-MANAGEMENT-SERVICE/api/v1/fares/lookup`  
   with route and stop IDs for price and currency.

2. **Conductor lookup:**  
   `GET http://USER-MANAGEMENT-SERVICE/api/v1/users/{conductorId}`  
   for name and phone number.

3. **Stop lookup:**  
   `GET /api/v1/bus-stops/{id}`  
   for origin/destination names.

4. **QR payload:**  
   JSON fields include conductor info, route/stop IDs & names, fare details, `transactionRef`, and `timestamp`.

5. **Encryption:**  
   Currently passthrough; replace with AES encryption when ready.

6. **QR rendering:**  
   ZXing generates a PNG, returned as Base64.


---

# Notification Service

Spring Boot microservice that delivers transactional emails (credentials, welcomes, password resets) for the GoCashless platform. It exposes REST endpoints for other services to trigger messages via SMTP.

## Features

- REST endpoints for conductor credentials, passenger welcomes, and password resets (`NotificationController` in `src/main/java/com/gocashless/notification/controller/NotificationController.java`).
- Email composition and dispatch using Spring’s `JavaMailSender` with templated bodies (`EmailService` at `src/main/java/com/gocashless/notification/service/EmailService.java`).
- DTO payloads that capture minimal context for each notification type (`src/main/java/com/gocashless/notification/dto`).
- Eureka client registration to stay discoverable by calling microservices.

## Architecture

| Layer | Implementation | Notes |
| ----- | -------------- | ----- |
| HTTP/API | `NotificationController` | Routes under `/api/v1/notifications`. |
| Service | `EmailService` | Builds `SimpleMailMessage` templates for the three notification families. |
| DTOs | `ConductorNotification`, `PassengerNotification`, `PasswordResetNotification` | Serialized request bodies. |
| Config | `application.yml` | SMTP credentials, port 8085, Eureka discovery. |

## Prerequisites

- JDK 21+
- Maven 3.9+ (or bundled `mvnw` / `mvnw.cmd`)
- SMTP provider (default config targets Gmail SMTP)
- Eureka server at `http://localhost:8761/eureka`
- Credentials for `SPRING_MAIL_USERNAME`/`SPRING_MAIL_PASSWORD` set as environment variables or secret manager

>  The checked-in `application.yml` contains placeholder Gmail credentials; replace these with environment variables before running in shared environments.

## Configuration

Override any of the following defaults via environment variables or command-line properties.

| Purpose | Property | Default |
| ------- | -------- | ------- |
| Server port | `SERVER_PORT` | `8085` |
| Service name | `SPRING_APPLICATION_NAME` | `notification-service` |
| SMTP host | `SPRING_MAIL_HOST` | `smtp.gmail.com` |
| SMTP port | `SPRING_MAIL_PORT` | `587` |
| SMTP username | `SPRING_MAIL_USERNAME` | *(redact in production)* |
| SMTP password | `SPRING_MAIL_PASSWORD` | *(redact in production)* |
| SMTP auth | `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` | `true` |
| SMTP STARTTLS | `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE` | `true` |
| Eureka zone | `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://localhost:8761/eureka` |

## Running Locally

``` bash
# Unix/macOS
SPRING_MAIL_USERNAME="you@example.com" \
SPRING_MAIL_PASSWORD="app-specific-password" \
./mvnw spring-boot:run

# Windows PowerShell
$env:SPRING_MAIL_USERNAME="you@example.com"
$env:SPRING_MAIL_PASSWORD="app-specific-password"
.\mvnw.cmd spring-boot:run
```
### API Reference

| Method | Path | Description | Request Body |
|--------|------|--------------|---------------|
| **POST** | `/api/v1/notifications/send-credentials` | Sends conductor login credentials. | `ConductorNotification` — `{ "email": "", "password": "" }` |
| **POST** | `/api/v1/notifications/send-passenger-welcome` | Sends passenger welcome email. | `PassengerNotification` — `{ "firstName": "", "lastName": "", "email": "", "registrationDate": "YYYY-MM-DD" }` |
| **POST** | `/api/v1/notifications/send-password-reset` | Sends password reset email with temporary password. | `PasswordResetNotification` — `{ "email": "", "password": "" }` |

### Email Templates

- **Credentials:**  
  Greets conductor and lists email/password with a reminder to change on first login.

- **Passenger Welcome:**  
  Confirms account setup and registration date; customize the body to eliminate stray characters  
  (see `EmailService`, line 23).

- **Password Reset:**  
  Shares new password and urges immediate change post-login.

Adjust the message strings in `EmailService` for localization or richer formatting  
(consider `MimeMessageHelper` for HTML emails).

---

# Simulated Payment (Fake-Pay) Service

Spring Boot microservice that emulates a payment processor for the GoCashless platform. It accepts ride-payment requests, applies a probabilistic success model, and logs successful payments to the Transaction History Service via OpenFeign.

## Features

- `/api/v1/payments/initiate` endpoint that simulates payment authorization with a configurable success rate (90% by default).
- Automatic propagation of successful transactions to the `transaction-history-service` (`TransactionHistoryServiceClient` in `src/main/java/com/gocashless/fakepay/client/TransactionHistoryServiceClient.java`).
- Simple DTOs for payment initiation (`PaymentInitiationRequest`) and response (`PaymentResponse`), plus shared transaction enums for reuse on the client side.
- Eureka discovery client registration to make the service discoverable by other GoCashless components.

## Architecture

| Layer | Implementation | Notes |
| ----- | -------------- | ----- |
| HTTP/API | `FakePaymentController` (`src/main/java/com/gocashless/fakepay/controller/FakePaymentController.java`) | Exposes the payment initiation endpoint. |
| Service Integration | `TransactionHistoryServiceClient` (`src/main/java/com/gocashless/fakepay/client`) | OpenFeign client to log transactions. |
| DTOs | `PaymentInitiationRequest`, `PaymentResponse`, `TransactionRequest` | Located under `src/main/java/com/gocashless/fakepay/dto` and `client/dto`. |
| Config | `application.yml` | Port 8083, Eureka discovery settings. |

## Prerequisites

- JDK 21+
- Maven 3.9+ (or use the bundled `mvnw`/`mvnw.cmd`)
- Eureka server running at `http://localhost:8761/eureka`
- Transaction History Service reachable via Eureka (service name `transaction-history-service`)

## Configuration

Set properties via `src/main/resources/application.yml` or override using environment variables.

| Purpose | Property | Default |
| ------- | -------- | ------- |
| Server port | `SERVER_PORT` | `8083` |
| Service name | `SPRING_APPLICATION_NAME` | `payment-processing-service` |
| Eureka zone | `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://localhost:8761/eureka` |
| Eureka registration | `EUREKA_CLIENT_REGISTER_WITH_EUREKA` | `true` |
| Eureka fetch | `EUREKA_CLIENT_FETCH_REGISTRY` | `true` |

The success rate is hard-coded at 90% (`Math.random() < 0.9` in the controller); adjust as needed before production use.

## Running Locally

``` bash
# Unix/macOS
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw.cmd spring-boot:run
```
### API Reference

| Method | Path | Description | Request Body | Response |
|--------|------|--------------|---------------|-----------|
| **POST** | `/api/v1/payments/initiate` | Simulates a rider payment and optionally records it in transaction history. | `PaymentInitiationRequest` (see below) | `PaymentResponse` (`transactionId`, `status`, `message`). |

### Request Payload (`PaymentInitiationRequest`)

``` json
{
  "userId": "UUID of passenger",
  "conductorId": "UUID of conductor",
  "routeId": "UUID of route",
  "originStopId": "UUID of origin stop",
  "destinationStopId": "UUID of destination stop",
  "amount": 25.50,
  "currency": "ZMW",
  "paymentMethod": "MOBILE_MONEY"
}
```
### Response (`PaymentResponse`)

``` json
{
  "transactionId": "generated UUID or null on failure",
  "status": "SUCCESS | FAILED | ERROR",
  "message": "Human-readable outcome"
}
```

### Behavior

- **On success:** waits ~1.5 seconds, forwards the transaction to `transaction-history-service`  
  with `TransactionType.FARE_PAYMENT` and `TransactionStatus.COMPLETED`, and returns a success message.

- **On history logging failure:** still returns `SUCCESS` but notes the logging issue.

- **On simulated failure (10% chance):** returns `FAILED` with an explanatory message.


---

# GoCashless Passenger App

Expo + React Native mobile client that lets passengers register, scan conductors’ QR codes, confirm fares, and review trip history in real time. It talks to the GoCashless backend microservices for identity, payments, and transaction archival.

## Core Features

- **Session-aware navigation** guards all protected routes and redirects guests to `/sign-in` (`app/_layout.jsx:1`, `context/AuthContext.js:5`).
- **Passenger onboarding** with email/phone validation plus login that tags requests with `X-Client-App=PASSENGER_MOBILE` (`app/sign-up.jsx:1`, `app/sign-in.jsx:1`).
- **QR scan & confirm flow** that decodes signed payloads, shows fare details, and posts payments to Fake Pay (`app/scanner.jsx:1`, `components/QrScanner.jsx:1`, `app/confirmPayment.jsx:1`, `services/paymentService.js:1`).
- **Transaction history tab** fetching journey receipts from Transaction History Service (`app/(tabs)/transactions.jsx:1`, `services/historyService.js:1`).
- **Profile management** for sign-out, password changes, and future profile edits (`app/(tabs)/profile.jsx:1`, `components/ChangePasswordModal.jsx:1`, `services/userApiClient.js:1`).
- **Midnight theme** palette applied globally with ready-to-swap themes (`constants/colors.js:1`).
- **Expo Router tab shell** with Home, History, and Profile tabs (`app/(tabs)/_layout.jsx:1`).

## Screen Map

| Screen | Purpose | Key Files |
| ------ | ------- | --------- |
| Sign Up / Sign In | Account creation & login | `app/sign-up.jsx`, `app/sign-in.jsx` |
| Tabs Home | Launch QR scanner | `app/(tabs)/index.jsx` |
| Scanner | Camera overlay & QR capture | `app/scanner.jsx`, `components/QrScanner.jsx` |
| Confirm Payment | Show payload, call Fake Pay | `app/confirmPayment.jsx`, `services/paymentService.js` |
| History | Passenger transactions | `app/(tabs)/transactions.jsx`, `services/historyService.js` |
| Profile | Account actions & password change | `app/(tabs)/profile.jsx`, `components/ChangePasswordModal.jsx` |

## Architecture

| Layer | Notes |
| ----- | ----- |
| **Routing** | Expo Router stack + tabs (`app/_layout.jsx`, `app/(tabs)/_layout.jsx`) |
| **State** | AuthContext provides user session & helpers (`context/AuthContext.js`) |
| **Services** | Axios/fetch wrappers per backend (`services/*.js`) |
| **Components** | Reusable UI: QR scanner, change-password modal (`components/*`) |
| **Styling** | Theme constants and shared styles (`constants/colors.js`, `assets/styles`) |
| **Config** | Expo app metadata & permissions (`app.json`) |

## Backend Dependencies

| Service | Usage | Default Host |
| ------- | ----- | ------------ |
| User Management Service | Login, profile CRUD, password update | `${API_BASE_URL}` via `services/userApiClient.js` |
| Fake Pay Service | POST `/api/v1/payments/initiate` for simulated checkout | `http://<host>:8083` (`services/paymentService.js`) |
| Transaction History Service | GET `/api/v1/transactions/user/:userId` | `http://<host>:7004` (`services/historyService.js`) |

Update the hard-coded base URLs (`services/apiConfig.js`, `services/paymentService.js`, `services/historyService.js`) or move them into `.env`/Expo config before shipping.

## Configuration

| Key | Where | Default |
| --- | ----- | ------- |
| API gateway base URL | `services/apiConfig.js` | `http://10.159.183.13:8765` |
| Fake Pay base URL | `services/paymentService.js` | `http://10.159.183.13:8083/api/v1` |
| Transaction history host | `services/historyService.js` | `http://10.159.183.13:7004` |
| QR secret (future use) | `.env` | `QR_ENCRYPTION_SECRET_KEY=...` |
| Expo camera permissions | `app.json` | Included for iOS/Android |

## Getting Started

1. **Install tooling**: Node 18+, npm 9+, Expo CLI (`npm install -g expo-cli`).
2. **Install deps**: `npm install` (or `pnpm i`) from project root (`package.json:1`).
3. **Configure endpoints**:
   - Update `services/apiConfig.js`, `services/paymentService.js`, `services/historyService.js`.
   - Ensure backend services are reachable from your emulator/device (use your LAN IP, not `localhost`).
4. **Start the app**: `npm start` (or `expo start`). Use QR or simulator to load.
5. **Grant camera access** when prompted to allow QR scanning.

## Workflow Tips

- Use the sample QR payload generator (`good-scan.html`) to produce valid JSON for testing.
- Confirm the Fake Pay service logs transactions successfully (returns `SUCCESS` status).
- Sign out from Profile before testing another account (`app/(tabs)/profile.jsx:1`).

## Testing & Quality

- Expo lint: `npm run lint`.
- Manual QA: run through sign-up → scan → confirm → history refresh.
- Consider adding Jest tests for context hooks & service functions (none included yet).

## Troubleshooting

| Issue | Check |
| ----- | ----- |
| Camera blank | Ensure `expo-camera` permissions accepted and not running on unsupported platform. |
| Login fails | Verify gateway URL and that UMS `/api/v1/auth/login` accepts `X-Client-App=PASSENGER_MOBILE`. |
| Payment errors | Confirm Fake Pay running at configured URL and responds within 1.5s timeout. |
| Empty history | Make sure transaction history service has data for the passenger ID. |
| Cookies/sessions | `withCredentials` is enabled. When debugging on Android emulator/device, backend must expose CORS + session cookies for mobile origin. |

## Tech Stack

- Expo SDK 53 (`package.json:1`)
- React Native 0.79, React 19
- Expo Router 5
- Expo Camera, Expo Haptics, Vector Icons
- Axios + fetch for HTTP

---

# GoCashless Conductor App

Expo + React Native application for bus conductors to manage journeys, generate passenger QR codes, review daily collections, and maintain their account. It integrates with the GoCashless backend for authentication, route data, QR generation, and transaction analytics.

## Core Features

- **Session-aware navigation** keeps conductors on `/home` once authenticated and forces guests to `/sign-in` (`app/_layout.jsx:1`, `context/AuthContext.js:5`).
- **Conductor login** posts credentials with `X-Client-App=CONDUCTOR_MOBILE` and stores session cookies for downstream calls (`app/sign-in.jsx:1`, `context/AuthContext.js:26`).
- **Journey setup + QR generation** pulls routes/stops, lets conductors pick origin/destination, and requests signed QR payloads from the QR service (`app/(tabs)/home.jsx:1`, `services/routeApiClient.js:1`, `services/qrApiClient.js:1`).
- **QR preview modal** renders Base64 images for passengers to scan (`components/QrCodeModal.jsx:1`).
- **Dynamic selection modal** filters routes/stops client-side for quick lookup (`components/SelectionModal.jsx:1`).
- **Transaction history** groups conductor settlements by day, showing status, stops, and totals (`app/(tabs)/transactions.jsx:1`, `services/historyService.js:1`).
- **Profile hub** displays account details, supports password updates, and signs out securely (`app/(tabs)/profile.jsx:1`, `components/ChangePasswordModal.jsx:1`, `services/userApiClient.js:1`).

## Screen Map

| Screen | Purpose | Key Files |
| ------ | ------- | --------- |
| Sign In | Authenticate conductor | `app/sign-in.jsx` |
| Home | Choose route/stops, generate QR | `app/(tabs)/home.jsx`, `components/QrCodeModal.jsx`, `components/SelectionModal.jsx` |
| Transactions | Review completed fares | `app/(tabs)/transactions.jsx` |
| Profile | View info, change password, sign out | `app/(tabs)/profile.jsx`, `components/ChangePasswordModal.jsx` |

## Architecture Overview

| Layer | Notes |
| ----- | ----- |
| **Routing** | Expo Router stack + tabs (`app/_layout.jsx`, `app/(tabs)/_layout.jsx`) |
| **State** | `AuthContext` handles session, login, logout (`context/AuthContext.js`) |
| **Services** | Axios clients per backend (`services/*.js`) using a shared host from `services/apiConfig.js` |
| **UI Components** | QR modal, selection modal, password modal stored in `components/` |
| **Styling** | Shared palette via `constants/colors.js` and style sheets under `assets/styles/` |
| **Expo Config** | App permissions & metadata in `app.json`

## Backend Integrations

| Service | Endpoint Usage | Client |
| ------- | -------------- | ------ |
| User Management Service (`:7000`) | `/api/v1/auth/login`, `/api/v1/users/me`, `/api/v1/users/{id}/password` | `services/userApiClient.js:1` |
| Route Fare Management Service (`:7001`) | `/api/v1/routes`, `/api/v1/bus-stops` | `services/routeApiClient.js:1` |
| QR Code Generation Service (`:7002`) | `/api/v1/qr/generate` | `services/qrApiClient.js:1` |
| Transaction History Service (`:7004`) | `/api/v1/transactions/conductor/{id}` | `services/historyService.js:1` |
| Payment Gateway / Fake Pay proxy | future integration via `/payment-processing-service` | `services/paymentApiClient.js:1` (placeholder)

Update the hard-coded host (`services/apiConfig.js:1`) to point at your environment or move to `.env` before production.

## Configuration

| Setting | Where | Default |
| ------- | ----- | ------- |
| API base host | `services/apiConfig.js` | `http://10.159.183.13` |
| Expo name/slug | `app.json` | `mobile-app-conductor` |
| Session cookies | Axios `{ withCredentials: true }` across API clients |
| Camera permissions | `app.json` for QR scanning (if added later) |

`.env` currently contains only placeholder values; use it for secrets when needed.

## Getting Started

1. **Install tooling**: Node 18+, npm 9+, Expo CLI.
2. **Install dependencies**: `npm install` in `mobile-app-conductor` (`package.json:1`).
3. **Configure hosts**:
   - Set `services/apiConfig.js` to your API gateway or LAN IP.
   - Ensure target microservices are reachable at the expected ports.
4. **Launch**: `npm start` (or `expo start`) to open Metro and scan the QR with Expo Go / run an emulator.
5. **Sign in** with a conductor account provisioned in the User Management Service. The app immediately fetches `/api/v1/users/me`, routes, and bus stops.

## Using the App

1. **Log In** → conductor credentials with mobile client header.
2. **Home**:
   - Select route, origin, destination (swap or clear selections).
   - Tap “Generate QR Code” to display a scannable image for passengers.
3. **Transactions**: View latest fares by day; statuses rely on transaction history data.
4. **Profile**: Review personal info, change password, or sign out.

## Testing & Validation

- Manual smoke test: sign in, generate QR, scan with passenger app, confirm payment, check history.
- Ensure Transaction History Service returns data or mock API responses during development.
- No automated tests bundled—add Jest tests for `AuthContext` and service wrappers as needed.

## Troubleshooting

| Issue | Resolution |
| ----- | ---------- |
| Blank route/stop lists | Confirm Route Fare Management Service reachable at configured host/port. |
| QR generation fails | Verify QR service is up (`:7002`) and conductor has valid session cookies. |
| Login rejected | Ensure conductor exists and `X-Client-App=CONDUCTOR_MOBILE` is accepted on backend. |
| Transaction history empty | Confirm Fake Pay and Transaction History services are recording conductor IDs. |
| Session lost | When testing on device, backend must set CORS + cookie attributes compatible with mobile origin. |

## Tech Stack

- Expo SDK 53, React Native 0.79, React 19 (`package.json:1`)
- Expo Router 5, Expo Fonts/Splash for UI polish
- Axios clients, Fetch for history service
- Reusable vector icons via `@expo/vector-icons`

---

# GoCashless Admin Web Portal

Next.js (App Router) dashboard that lets GoCashless operators manage routes, fares, user accounts, and monitor system-wide KPIs. It authenticates against the User Management Service, fetches analytics from the Transaction History Service, and performs CRUD on transport data exposed by the Route Fare Management Service.

## Highlights

- **Session Guard + Layout Shell** — `AuthLayout` automatically redirects guests to `/login` and signed-in admins to `/dashboard`, while `DashboardLayout` renders the sidebar/header chrome (`src/components/layout/AuthLayout.jsx:1`, `src/components/layout/DashboardLayout.jsx:1`).
- **Zustand Auth Store** — `useAuthStore` stores the current admin, kicks off `/api/v1/users/me` on load, and exposes `login/logout` helpers to hooks and pages (`src/store/authStore.js:1`, `src/hooks/useAuth.js:1`).
- **API Clients** — Axios instances target the Gateway, Route/Fare service, and Transaction History service with cookie auth and optional bearer token injection (`src/lib/api/apiClient.js:1`, `src/lib/api/routeApiClient.js:1`, `src/lib/api/thsApiClient.js:1`).
- **Dashboard Analytics** — KPI cards and Recharts visualizations pull revenue, transaction mix, and leaderboards via `dashboardService` (`src/app/(dashboard)/dashboard/page.jsx:1`, `src/lib/api/dashboardService.js:1`).
- **Operations Modules** — Dedicated sections manage routes, stops, fares, conductors, passengers, admins, and settings through typed services like `routeService`, `busStopService`, `fareService`, `conductorService`, `adminService`, and `transactionService`.
- **Design System** — Tailwind CSS v4 styling, Lucide icons, reusable inputs/buttons, and responsive sidebar toggling (`src/components/ui/Input.jsx:1`, `src/components/layout/Sidebar.jsx:1`, `tailwind.config.js:1`, `src/app/globals.css:1`).
- **Next.js 15 + React 19** — modern App Router, Turbopack-enabled dev server, and server/client component composition (`package.json:1`, `src/app/layout.js:1`).

## Feature Modules

| Area | Purpose | Key Files |
| ---- | ------- | --------- |
| Auth | Email/password login, guard | `src/app/(auth)/login/page.jsx:1`, `src/hooks/useAuth.js:1` |
| Dashboard | KPIs, charts, leaderboards | `src/app/(dashboard)/dashboard/page.jsx:1`, `src/components/dashboard/*` |
| Routes | CRUD routes, navigate to stops | `src/app/(dashboard)/dashboard/routes/page.jsx:1`, `src/lib/api/routeService.js:1` |
| Bus Stops | Manage stops per route | `src/app/(dashboard)/dashboard/routes/bus-stops/page.jsx:1`, `src/lib/api/busStopService.js:1` |
| Fares | Manage fare tables & lookup | `src/app/(dashboard)/dashboard/routes/fares/page.jsx:1`, `src/lib/api/fareService.js:1` |
| Conductors | Invite/manage conductors | `src/app/(dashboard)/dashboard/conductors/page.jsx:1`, `src/lib/api/conductorService.js:1` |
| Passengers | View passenger roster | `src/app/(dashboard)/dashboard/passengers/page.jsx:1`, `src/lib/api/passengerService.js:1` |
| Admins | Provision admin accounts | `src/app/(dashboard)/dashboard/settings/admins/page.jsx:1`, `src/lib/api/adminService.js:1` |
| Transactions | Browse raw history | `src/app/(dashboard)/dashboard/transactions/page.jsx:1`, `src/lib/api/transactionService.js:1` |

## Backend Dependencies

| Service | Base URL (default) | Used For | Client |
| ------- | ------------------ | -------- | ------ |
| API Gateway / User Mgmt | `http://localhost:8765` | Auth, admin/conductor CRUD, passengers | `src/lib/api/apiClient.js:1`, `src/lib/api/userApiClient.js:1`, `src/lib/api/authService.js:1` |
| Route Fare Management | `http://localhost:7001` | Routes, bus stops, fares | `src/lib/api/routeApiClient.js:1`, `src/lib/api/routeService.js:1`, `src/lib/api/busStopService.js:1`, `src/lib/api/fareService.js:1` |
| Transaction History | `http://localhost:7004` | KPIs, charts, history listings | `src/lib/api/thsApiClient.js:1`, `src/lib/api/dashboardService.js:1`, `src/lib/api/transactionService.js:1` |

> Update the `baseURL` values for hosted environments or expose them via environment variables (e.g., `NEXT_PUBLIC_API_BASE_URL`) before production.

## Configuration

| Setting | Location | Default |
| ------- | -------- | ------- |
| App metadata & fonts | `src/app/layout.js:1` | Geist Sans/Mono, title `"Create Next App"` |
| Global styles | `src/app/globals.css:1` | Tailwind tokens + custom variables |
| API base host | `src/lib/api/apiClient.js:1` | `http://localhost:8765` |
| Route/Fare host | `src/lib/api/routeApiClient.js:1` | `http://localhost:7001` |
| THS host | `src/lib/api/thsApiClient.js:1` | `http://localhost:7004` |
| Tailwind setup | `tailwind.config.js:1`, `postcss.config.mjs:1` | Tailwind CSS v4 pipeline |
| ESLint config | `eslint.config.mjs:1` | Next.js + Tailwind rules |

## Getting Started

1. **Install prerequisites**
   - Node 20+ (recommended for Next.js 15.5)
   - npm 10+ or pnpm 9+

2. **Install dependencies**
   ``` bash
   npm install
   ```
###  Configure API Hosts

- Adjust `src/lib/api/apiClient.js`, `routeApiClient.js`, and `thsApiClient.js` to point to your gateway/services.  
- Ensure the GoCashless backend stack is running locally or accessible over LAN/VPN.


###  Run the Dev Server

``` bash
npm run dev
```
### Tech Stack

- **Framework:** Next.js 15 (App Router) ([package.json:1](package.json:1))
- **Runtime:** React 19, Turbopack dev server
- **State:** Zustand for auth/global session ([src/store/authStore.js:1](src/store/authStore.js:1))
- **Charts:** Recharts
- **HTTP:** Axios clients with cookie + token support
- **UI:** Tailwind CSS v4, Lucide React icons, bespoke components
- **Tooling:** ESLint 9, PostCSS, Turbopack

---

# GoCashless API Gateway

Spring Cloud Gateway (WebFlux) front door for the GoCashless microservices. It centralises routing, CORS, and discovery via Netflix Eureka so web/mobile clients can hit a single origin (`http://localhost:8765` by default).

## Highlights

- **Spring Cloud Gateway WebFlux** (`spring-cloud-starter-gateway-server-webflux`) for reactive routing (`src/main/java/com/gocashless/apigateway/config/GatewayConfig.java:8`).
- **Service Discovery** via `@EnableDiscoveryClient` to resolve `lb://service-name` URIs against Eureka (`src/main/java/com/gocashless/apigateway/ApiGatewayApplication.java:7`).
- **Route Map** for user management, route/fare management, and QR generation services (`src/main/java/com/gocashless/apigateway/config/GatewayConfig.java:12`).
- **Global CORS** allowing credentialed calls from the admin web app (`application.yml:14`).
- **Security Hooks** – two filter-chain beans exist (`GatewaySecurityConfig` permitting all, `SecurityConfig` requiring auth except `/api/v1/auth/**`). Reconcile them before production to avoid ambiguity.

## Route Catalogue

| Route ID | Path Predicate(s) | Target URI |
| -------- | ----------------- | ---------- |
| `user-management-service-auth` | `/api/v1/auth/**` | `lb://user-management-service` |
| `user-management-service` | `/api/v1/users/**` | `lb://user-management-service` |
| `route-fare-management-service` | `/api/v1/routes/**`, `/api/v1/bus-stops/**`, `/api/v1/fares/**` | `lb://route-fare-management-service` |
| `qr-code-generation-service` | `/api/v1/qr/**` | `lb://qr-code-generation-service` |

Add additional `route()` definitions in `GatewayConfig` when new services come online.

## Configuration

`src/main/resources/application.yml` controls server port, routes, CORS, and discovery.

| Key | Default | Notes |
| --- | ------- | ----- |
| `server.port` | `8765` | External entrypoint |
| `spring.cloud.gateway.routes` | see above | Define predicates & URIs |
| `spring.cloud.gateway.globalcors.cors-configurations` | `http://localhost:3000` allowed | Enable cookie-based web clients |
| `eureka.client.serviceUrl.defaultZone` | `http://localhost:8761/eureka` | Discovery server |
| `server.forward-headers-strategy` | `framework` | Preserves headers (important for proxies) |

### Security

Two reactive configurations ship with the project:

1. `GatewaySecurityConfig` (`src/main/java/com/gocashless/apigateway/config/GatewaySecurityConfig.java:8`): disables CSRF and permits all exchanges.
2. `SecurityConfig` (`src/main/java/com/gocashless/apigateway/config/SecurityConfig.java:9`): disables CSRF, allows `/api/v1/auth/**`, requires auth elsewhere.

Decide which policy you want (session propagation vs. token enforcement) and remove/merge redundant beans to avoid conflicts.

## Prerequisites

- JDK 21+
- Maven 3.9+ (or use the bundled `mvnw`/`mvnw.cmd`)
- Eureka discovery server running at `http://localhost:8761/eureka`
- Downstream microservices registered with Eureka

## Running Locally

``` bash
# from api-gateway/
./mvnw spring-boot:run
# or on Windows
.\mvnw.cmd spring-boot:run
```
---

# Eureka Discovery Service

Spring Boot application that hosts the Netflix Eureka registry for the GoCashless microservice fleet. Other services (API Gateway, user management, route/fare, etc.) register here to enable load-balanced `lb://service-name` routing.

## Highlights

- Minimal Spring Boot app annotated with `@EnableEurekaServer` (`src/main/java/com/server/eureka/EurekaApplication.java:6`).
- Runs on port **8761** by default (`src/main/resources/application.yml:3`).
- Server-only configuration: the registry does not register with itself (`src/main/resources/application.yml:6`).
- Spring Cloud 2025.x + Boot 3.5 stack defined in `pom.xml:4`.

## Configuration

`src/main/resources/application.yml` is intentionally lean:

| Key | Value | Purpose |
| --- | ----- | ------- |
| `spring.application.name` | `eureka` | Service ID |
| `server.port` | `8761` | Registry endpoint |
| `eureka.client.register-with-eureka` | `false` | Don’t self-register |
| `eureka.client.fetch-registry` | `false` | Don’t fetch remote registries |

Expose this port to your network or tunnel it to remote clients so other services can connect.

## Prerequisites

- JDK 21+
- Maven 3.9+ (or bundled `mvnw` / `mvnw.cmd`)
- At least one Eureka client configured to register against `http://<host>:8761/eureka`

## Running Locally

```bash
# macOS/Linux
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw.cmd spring-boot:run
```