# Distributed B2B SaaS Platform

A distributed B2B SaaS platform where each tenant has their own isolated hosting environment, domain, and database. The platform includes license validation, WMS synchronization, and self-update capabilities.

## 🏗️ Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   SaaS Provider     │         │      WMS System     │
│   (provider.com)    │         │                     │
└─────────┬───────────┘         └──────────┬──────────┘
          │                                 │
          │ License API                     │ Webhook/API
          │ Git Updates                     │
          ▼                                 ▼
┌─────────────────────────────────────────────────────┐
│              Tenant Application                      │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │   Angular    │◄───│      Laravel 12 API      │   │
│  │   Frontend   │    │                          │   │
│  └──────────────┘    └────────────┬─────────────┘   │
│                                   │                  │
│                      ┌────────────┴────────────┐    │
│                      ▼                         ▼    │
│               ┌──────────┐              ┌─────────┐ │
│               │PostgreSQL│              │ MongoDB │ │
│               │ (Data)   │              │ (Logs)  │ │
│               └──────────┘              └─────────┘ │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- PHP 8.3+ (for local development)
- Composer 2.x

### Using Docker (Recommended)

This repository is designed to run alongside the [SaaS Provider](../saas-provider).

**Recommendation:**
Use the `start_platform.sh` (or `.bat`) script located in the `saas-provider` repository to start both applications simultaneously.

👉 [Read full INSTALL.md for details](INSTALL.md)

### Manual Docker Start
If running standalone:
```bash
docker network create saas-network
docker-compose up -d --build
```

**Access:**
- Frontend: http://localhost:4200
- API: http://localhost:8000/api
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017

### Local Development

#### Backend
```bash
cd tenant-app
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env
php artisan migrate
php artisan serve
```

#### Frontend
```bash
cd tenant-frontend
npm install
npm run start
```

## 📁 Project Structure

```
internetprogramlama/
├── tenant-app/                 # Laravel 12 Backend
│   ├── app/
│   │   ├── Enums/              # OrderStatus, UserRole, etc.
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   └── Middleware/     # LicenseMiddleware, AdminMiddleware
│   │   ├── Jobs/               # WmsSyncStockJob
│   │   ├── Models/             # 10 Eloquent models
│   │   └── Services/
│   │       ├── License/        # Phone-home validation
│   │       ├── Update/         # Self-update service
│   │       └── Wms/            # WMS sync services
│   ├── config/
│   │   ├── license.php         # License configuration
│   │   └── wms.php             # WMS configuration
│   └── database/migrations/    # 12 migration files
│
├── tenant-frontend/            # Angular 19 Frontend
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/         # authGuard, adminGuard
│   │   │   ├── interceptors/   # Auth, Error interceptors
│   │   │   ├── models/         # TypeScript interfaces
│   │   │   └── services/       # 5 services with Signals
│   │   ├── features/
│   │   │   ├── admin/          # Admin orders
│   │   │   ├── auth/           # Login
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── orders/         # Order list/detail
│   │   │   └── products/       # Product catalog
│   │   └── shared/components/  # Header
│   └── tailwind.config.js
│
├── docker-compose.yml
├── Dockerfile
└── memory_bank/                # Project context docs
```

## 🔑 Environment Variables

### Backend (.env)
```env
# Application
APP_NAME="Tenant App"
APP_ENV=local
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=tenant_db
DB_USERNAME=tenant_user
DB_PASSWORD=secret

# MongoDB (Logging)
MONGODB_URI=mongodb://mongo:27017/tenant_logs

# License Configuration
LICENSE_KEY=your-license-key
LICENSE_PROVIDER_URL=https://provider.com/api
LICENSE_CACHE_TTL=3600
LICENSE_GRACE_PERIOD_HOURS=72

# WMS Configuration
WMS_API_URL=https://wms.example.com/api
WMS_API_KEY=your-wms-api-key
WMS_WEBHOOK_SECRET=your-webhook-secret
WMS_SYNC_INTERVAL=5
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | - | Login |
| POST | `/api/auth/logout` | ✓ | Logout |
| GET | `/api/auth/me` | ✓ | Profile |
| GET | `/api/products` | ✓ | Product list (filtered) |
| GET | `/api/products/{id}` | ✓ | Product detail |
| GET | `/api/brands` | ✓ | Active brands |
| GET | `/api/categories` | ✓ | Category tree |
| GET | `/api/cart` | ✓ | View cart |
| POST | `/api/cart/items` | ✓ | Add to cart |
| PUT | `/api/cart/items/{id}` | ✓ | Update quantity |
| DELETE | `/api/cart/items/{id}` | ✓ | Remove item |
| GET | `/api/orders` | ✓ | User orders |
| POST | `/api/orders` | ✓ | Place order |
| GET | `/api/admin/orders` | Admin | All orders |
| POST | `/api/admin/orders/{id}/approve` | Admin | Approve |
| GET | `/api/admin/updates/check` | Admin | Check updates |
| POST | `/api/admin/updates/perform` | Admin | Run update |
| POST | `/api/wms/webhook` | Signature | WMS events |

## 🔄 Key Features

### License Validation
- Phone-home to SaaS Provider API
- 72-hour grace period if provider unreachable
- Cached validation (1 hour TTL)

### WMS Sync
- Real-time webhook updates
- Scheduled sync every 5 minutes
- Batch processing (100 records)
- Failed sync logs to MongoDB

### Self-Update
- Git-based updates via admin panel
- Maintenance mode during update
- Automatic rollback on failure

## 🧪 Testing

```bash
# Backend tests
cd tenant-app
php artisan test

# Frontend build verification
cd tenant-frontend
npm run build
```

## 📜 License

Proprietary - All rights reserved
