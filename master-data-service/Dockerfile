# ---------- build stage ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

LABEL org.opencontainers.image.source=https://github.com/robinb00/clc-2025-project

WORKDIR /build

COPY pom.xml .
COPY api-gateway ./api-gateway
COPY order-service ./order-service
COPY master-data-service ./master-data-service
COPY inventory-service ./inventory-service

RUN mvn -B clean package -DskipTests

# ---------- runtime stage ----------
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=builder /build/master-data-service/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-XX:+UseContainerSupport","-jar","app.jar"]
