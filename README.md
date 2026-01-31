# Microservices Storage System Transformation

CLC 2025 – Cloud-Native Systems Project

This project demonstrates the design, deployment and operation of a
cloud-native microservices system on Kubernetes.

## Team Members

* Selina Adlberger
* Robin Berger
* Jonas Miesenböck

---

##  Table of Contents
1. [Project Overview](#1-project-overview)
2. [Research & Architecture](#2-architecture--research)
3. [Tutorial: Getting Started](#3-tutorial-getting-started)
4. [Observability & Monitoring](#4-observability--monitoring)
5. [Lessons Learned](#5-lessons-learned)

---

## 1. Project Overview

This project focuses on designing and operating a cloud-native system on Kubernetes. To provide a realistic foundation, we deployed a minimal microservices-based storage and order management application.

This application serves to demonstrate cloud-native infrastructure concepts rather than feature-complete business logic. The core objective is to design, deploy, and operate a cloud-native architecture that demonstrates key principles such as:
- Containerized microservices
- Automated deployments via Kustomize 
- Service Discovery & API Gateway patterns 
- Observability (Metrics & Monitoring)

The system is implemented in **Java with Spring Boot**, containerized using Docker, and orchestrated on **Kubernetes (kind)**.

---

## 2. Architecture & Research

In this section, we summarize our research regarding the architectural style and the tooling required to implement a cloud-native system.


### 2.1. Architectural Decisions (Research)



### 2.2. High-Level Architecture

![Architecture Diagram](./docs/architecture_diagram.png) 

- **External Traffic:** All traffic enters the system via the API Gateway.
- **Internal Communication:** Services communicate synchronously using Kubernetes DNS Service Discovery.
- **Monitoring:** Prometheus and Grafana run alongside the application in the same cluster. 


### 2.3. Technology Stack & Tooling
#### Kubernetes
####  CI/CD


### 2.4. Implemented System

The system consists of four lightweight microservices, an API Gateway and a minimal frontend.
The services are intentionally simple and serve primarily to demonstrate cloud-native behavior.

#### API Gateway & Frontend
- **Tech:** Spring Cloud Gateway, SPA (HTML/JS)
- **Role:** Single entry point, routes requests to backend services
- **Purpose:** Trigger requests and generate load

#### Master Data Service
- **Tech:** Java, Spring Boot
- **Role:** Provides static product data
- **Design:** Stateless microservice

#### Order Service
- **Tech:** Java, Spring Boot
- **Role:** Simulates order creation and inter-service communication

#### Inventory Service
- **Tech:** Java, Spring Boot
- **Role:** Manages stock levels based on orders

---

## 3. Tutorial: Getting Started

Follow these steps to reproduce the environment locally.

---

### Prerequisites
* **Docker Desktop** (running)
* **Kind** (Kubernetes in Docker)
* **Kubectl**
* **Git**
* **GitHub Personal Access Token (PAT)** 

---

### Step 1: Build & Prepare (Optional)

If you want to build the code from source instead of pulling existing images:

```bash
# Build Java Artifacts
./mvnw clean package -DskipTests

# Build Docker Images
docker build -t ghcr.io/robinb00/api-gateway:latest .
docker build -t ghcr.io/robinb00/order-service:latest ./order-service
# ... repeat for other services
```

### Step 2: Kubernetes Cluster Setup & Deployment

```bash
# create cluster
kind create cluster --name storage-system
# change context
kubectl config use-context kind-storage-system
# create namespace
kubectl apply -f k8s/namespace.yaml
```

### Step 3: Deployment

To pull images from the GitHub Container Registry (GHCR), we need to create a secret.

```bash
kubectl create secret docker-registry ghcr-credentials \
  --docker-server=ghcr.io \
  --docker-username=<GITHUB-USERNAME> \
  --docker-password=<PAT-TOKEN> \
  --docker-email=<EMAIL> \
  -n storage-system
  
# deploy cluster
kubectl apply -k k8s/overlays/dev
```


### Step 4: Verify Deployment

Check if all pods are running:

```bash
kubectl get pods -n storage-system
```

Once running, forward the API Gateway port to access the frontend:

```bash
kubectl port-forward svc/api-gateway 8080:8080 -n storage-system
```

**Open Application:** http://localhost:8080/index.html

---

## 4. Observability & Monitoring

```bash
# Access Grafana
kubectl port-forward svc/grafana -n storage-system 3000:3000
```

**URL**: http://localhost:3000



## 5. Lessons Learned
During the transition from local development to a cloud-native Kubernetes environment, we encountered and solved several key challenges:
