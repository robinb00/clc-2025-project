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
# Create cluster
kind create cluster --name storage-system
# Change context
kubectl config use-context kind-storage-system
# Create namespace
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
  
# Deploy cluster
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

### Technology Stack

This stack utilizes [**Prometheus**](https://prometheus.io) for metric collection, paired with [**Grafana**](https://grafana.com) for data visualization, and alerting. This combination provides real-time insights into the cluster's performance and health.

* **Prometheus (Database Layer):** Prometheus acts as the storage system's time-series database. It actively scrapes metrics from applications and infrastructure at regular intervals.
* **Grafana (Visualization Layer):** While Prometheus is powerful, its native UI is designed for debugging rather than long-term monitoring. Grafana connects to Prometheus as a **Data Source**, querying the metrics and transforming raw numbers into easily customizable visualizations. 

### Accessing the Web Interfaces
To access the dashboards locally, you must forward the service ports:

```bash
# Forward Prometheus to localhost:9090
kubectl port-forward svc/prometheus -n storage-system 9090:9090

# Forward Grafana to localhost:3000
kubectl port-forward svc/grafana -n storage-system 3000:3000
```

If the port forwarding is set up correctly, you can access the web interfaces via the URLs below.

**Prometheus URL**: http://localhost:9000

**Grafana URL**: http://localhost:3000

### Configuring Slack Alerts (Optional)

To receive notifications in your Slack workspace, update the webhook configuration in the [grafana-alerting.yaml](k8s/overlays/dev/prometheus-grafana/grafana-alerting.yaml) file.

1. **Update the Webhook:** Replace the `SLACK_WEBHOOK_URL_PLACEHOLDER` in the [grafana-alerting.yaml](k8s/overlays/dev/prometheus-grafana/grafana-alerting.yaml) file with your desired Slack webhook URL.

```yaml
# Snippet from grafana-alerting.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-alerting
  namespace: storage-system
data:
  alerting.yaml: |
    apiVersion: 1

    contactPoints:
      - orgId: 1
        name: Slack-Channel
        receivers:
          - uid: slack-notifier
            type: slack
            settings:
              icon_emoji: ':rotating_light:'
              url: SLACK_WEBHOOK_URL_PLACEHOLDER
              username: Grafana Bot
            disableResolveMessage: false
```
2. **Apply and Refresh:** If the cluster is already running, run the following commands to apply the new ConfigMap and restart the Grafana pod to pick up the changes
```bash
# Apply cluster configurations
kubectl apply -k k8s/overlays/dev

# Restart Grafana by deleting the existing pod
kubectl delete pod -l app=grafana -n storage-system
```

### Prometheus Web Interface

The Prometheus UI is your primary tool for ad-hoc queries and verifying that metrics are being collected correctly.

Graph/Expression Tab: Use this to write PromQL (Prometheus Query Language) queries. For example, typing up will show you which targets are currently being monitored.

Status > Targets: This is a crucial page for troubleshooting. It shows every endpoint Prometheus is trying to scrape and whether the connection is "UP" or "DOWN."

Alerts: Displays all configured alerting rules and their current state (Inactive, Pending, or Firing).

### Grafana Web Interface

Grafana is where you will spend most of your time observing the health of the storage system through visual dashboards.

Dashboards: Navigate to the "Dashboards" section to view pre-configured visualizations. These dashboards pull data from Prometheus and display it in real-time.

Data Sources: Under "Connections," you will find Prometheus listed as the primary data source. This connection is pre-configured via the deployment manifests.

Alerting: While Prometheus evaluates the math behind alerts, Grafana manages the human side—routing those alerts to Slack, Email, or PagerDuty.


## 5. Lessons Learned
During the transition from local development to a cloud-native Kubernetes environment, we encountered and solved several key challenges:
