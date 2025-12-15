# Microservices Storage System Transformation

CLC 2025 Project

## Team Members

* Selina Adlberger
* Robin Berger
* Jonas Miesenböck

---

## Project Overview

This project focuses on designing and implementing a **microservices-based storage and order management system** using Java and the Springboot. We will **rebuild and modernize a previously developed storage system project** that was originally implemented as part of our
bachelor's C# course.

The goal is to reuse the **domain concept and functional scope** of that storage system while re-implementing it as a **cloud-native microservices architecture**. By decomposing the system into independently deployable services and orchestrating them with Kubernetes, we aim to demonstrate practical principles of distributed systems, service boundaries, and containerized deployment.

Each microservice will own its **persistence layer and database schema**, and communication between services will be limited to **well-defined REST APIs** to avoid shared data models and tight coupling.

---

## Background: Existing System

In a previous course project, a storage and order management system was implemented in **C#**, with multiple user interfaces built on top of a shared backend. The system covered typical business functionality such as:

* Management of master data (e.g. products, storage units/locations)
* Adding and removing Items from storage
* Persisting of storage states to a database

For this project, the **existing implementation will not be reused directly**. Instead, the system will be **redesigned and reimplemented in Java**, following microservices principles and modern DevOps practices.

---

## What We Will Develop

We will design and implement a system consisting of **approximately four microservices**, plus an API Gateway and a simple web frontend.

### Microservices

* **Master Data Service**
  Responsible for managing core reference data (e.g. products, customers, or other domain-specific master data).

* **Order Service**
  Handles the creation, processing, and querying of orders. This service represents the central business workflow of the system.

* **Inventory Service**
  Managing stock levels for products.

* **API Gateway**
  Acts as the single entry point for the frontend, routing incoming requests to the appropriate backend services.

No dedicated user authentication or login service will be implemented, as authentication is not required to demonstrate the architectural goals of this project.

---

### Frontend

A **simple web-based frontend** will be developed to interact with the backend services via the API Gateway. The focus is on functionality and integration rather than visual design or advanced UI features.

---

### Containerization and Orchestration

* Each microservice will be **containerized using Docker**.
* The system will be orchestrated using **Kubernetes**, running locally via **kind (Kubernetes in Docker)**.
* No external or commercial cloud infrastructure is required; all deployments will run in a local Kubernetes environment.

---

### CI/CD Pipeline

A GitHub Actions–based CI pipeline will be set up to:

* Build and test all services
* Perform basic quality checks
* Build Docker images for the microservices

---

## Architecture Diagram

![Architecture Diagram](docs/architecture_diagram.png)

---

## Milestones

| Date           | Milestone                                | Status     |
| :------------- | :--------------------------------------- | :--------- |
| **15.12.2025** | Proposal & Repository Setup              | ✅ Done     |
| **20.12.2025** | Local Environment Setup & API Definition | 📅 Planned |
| **04.01.2026** | Core Service Implementation              | 📅 Planned |
| **08.01.2026** | API Gateway Setup                        | 📅 Planned |
| **12.01.2026** | Dockerization & CI Pipeline Setup        | 📅 Planned |
| **19.01.2026** | Integration & System Testing             | 📅 Planned |
| **26.01.2026** | Code Freeze & Documentation              | 📅 Planned |
| **02.02.2026** | Final Presentation                       | 📅 Planned |

---

## Distribution of Work and Responsibilities

*Disclaimer:* While the following distribution outlines primary responsibilities, major architectural decisions, service boundaries, and code reviews will be handled collaboratively by the entire team.

### 👤 Selina – Feature & Gateway Lead

* API Gateway Configuration: Design and implementation of routing and request handling between frontend and backend services.
* Master Data Service: Primary responsibility for implementation, API design, and persistence of the master data service.
* Frontend Integration: Development and integration of the simple web frontend using the API Gateway.

### 👤 Robin – Containerization & Orchestration Lead

* Inventory Service: Primary responsibility for implementation, API design, and persistence of the inventory-related domain service.
* Container Strategy: Definition of a consistent container architecture, base images, and build conventions.
* Service Containerization & Orchestration: Creation of Dockerfiles and Kubernetes manifests, and operation of the system locally using kind.

### 👤 Jonas – DevOps & CI Lead

* Order Service: Primary responsibility for implementation, API design, and persistence of the order management service.
* Environment Setup: Initialization of the GitHub repository and configuration of the Java/Maven development environment.
* CI Pipeline & Quality Assurance: Setup of GitHub Actions workflows for building, testing, Docker image creation, and static analysis.

---

### 🤝 Shared Responsibilities

* Service Design and Integration
* Documentation
* Preparation of the final presentation
