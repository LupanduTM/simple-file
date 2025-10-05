
# Gocashless Web App - Feature Checklist

This file outlines the development tasks for the Bus Company web application.

## Phase 1: Core User & Conductor Management

- [ ] **User Authentication**
  - [ ] Create a registration page for Bus Company owners.
  - [ ] Create a login page.
  - [ ] Implement API calls to the `user-management-service` for registration and login.
  - [ ] Implement session management (e.g., storing JWT).

- [ ] **Conductor Management**
  - [ ] Create a page to display a list of conductors for the logged-in company.
  - [ ] Create a form/modal to add a new conductor.
  - [ ] Implement API calls to register conductors via the `user-management-service`.
  - [ ] (Optional) Add functionality to edit or deactivate conductors.

## Phase 2: Dashboard and Reporting

- [ ] **Dashboard UI**
  - [ ] Design a dashboard layout.
  - [ ] Add components to display key metrics (e.g., Total Revenue, Total Transactions).

- [ ] **Transaction Viewing**
  - [ ] Create a table to display a live feed of transactions from the company's conductors.
  - [ ] Implement API calls to a future `transaction-history-service` to fetch data.
  - [ ] Add filtering options (e.g., by date, by conductor).

- [ ] **Data Visualization**
  - [ ] Add charts to visualize revenue trends (e.g., daily, weekly).
  - [ ] Add a chart to compare performance across different conductors.

## Phase 3: Advanced Features

- [ ] **Reporting**
  - [ ] Implement functionality to generate and export transaction reports (e.g., as CSV or PDF).
- [ ] **Profile Management**
  - [ ] Allow bus company owners to view and edit their profile information.
