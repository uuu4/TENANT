# 📦 Tenant Application - Installation Guide

This repository (`TENANT`) contains the **distributed tenant application** (E-commerce Store + API). It is designed to work in conjunction with the [SaaS Provider](../saas-provider).

## 📋 Prerequisites
- **Docker Desktop**
- **Git**
- **Running SaaS Provider** (Required for license validation)

## 🚀 How to Run

### Method 1: Using the Master Script (Recommended)
This requires the `saas-provider` repository to be cloned next to this one.

1. Go to the `saas-provider` directory.
2. Run `./start_platform.sh` (Mac/Linux) or `start_platform.bat` (Windows).
3. This will automatically start the Provider AND this Tenant App.

### Method 2: Standalone Manual Run
If you only want to run the Tenant App (assuming `saas-provider` is already running on `saas-network`):

1. **Create Network** (If not exists):
   ```bash
   docker network create saas-network
   ```

2. **Start Containers**:
   ```bash
   docker-compose up -d --build
   ```

3. **Setup (First Time Only)**:
   The `entrypoint.sh` script should handle this automatically. If not, you can run:
   ```bash
   docker exec -it tenant-api php artisan migrate --force
   docker exec -it tenant-api php artisan db:seed --force
   ```

## 🌐 Access Points

| Service | URL | Credentials |
|---|---|---|
| **Tenant Storefront** | [http://localhost:4200](http://localhost:4200) | `admin@test.com` / `password123` |
| **Tenant API** | [http://localhost:8000](http://localhost:8000) | - |

## 🔗 Integration
This app connects to `http://provider-api:8000` (internal Docker hostname) to validate its license key (`SAAS-SZNE-53LV-HOFY-WPPJ`).
