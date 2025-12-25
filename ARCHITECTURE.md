# 🏗️ Distributed B2B SaaS Platform - Detaylı Mimari

## Genel Bakış

Bu platform, her kiracının (tenant) kendi izole ortamına, domain'ine ve veritabanına sahip olduğu dağıtık bir B2B SaaS çözümüdür.

---

## 1. Sistem Mimarisi - Üst Düzey

```mermaid
graph TB
    subgraph "☁️ SaaS Provider (provider.com)"
        LP[("📋 License API")]
        GR[("📦 Git Repository")]
    end
    
    subgraph "🏭 WMS System"
        WMS[("📊 Warehouse Management")]
    end
    
    subgraph "🌐 Tenant Application (tenant.example.com)"
        subgraph "Frontend Layer"
            ANG["🅰️ Angular 19 SPA"]
        end
        
        subgraph "Backend Layer"
            LAR["🔷 Laravel 12 API"]
        end
        
        subgraph "Data Layer"
            PG[("🐘 PostgreSQL")]
            MG[("🍃 MongoDB")]
        end
        
        ANG -->|"REST API"| LAR
        LAR -->|"CRUD Operations"| PG
        LAR -->|"Logging"| MG
    end
    
    LAR <-->|"License Validation"| LP
    LAR <-->|"Self-Update"| GR
    WMS -->|"Webhooks"| LAR
    LAR -->|"Stock Sync"| WMS
    
    style LP fill:#9b59b6,color:#fff
    style GR fill:#9b59b6,color:#fff
    style WMS fill:#e74c3c,color:#fff
    style ANG fill:#3498db,color:#fff
    style LAR fill:#27ae60,color:#fff
    style PG fill:#f39c12,color:#fff
    style MG fill:#2ecc71,color:#fff
```

---

## 2. Angular 19 Frontend Mimarisi

```mermaid
graph TB
    subgraph "🅰️ Angular 19 Frontend"
        subgraph "Core Module"
            GRD["🔒 Guards<br/>authGuard, adminGuard"]
            INT["🔄 Interceptors<br/>Auth, Error"]
            SRV["⚙️ Services<br/>Auth, Product, Cart, Order, WMS"]
            MOD["📝 Models<br/>TypeScript Interfaces"]
        end
        
        subgraph "Feature Modules"
            AUTH["🔐 Auth<br/>Login/Logout"]
            PROD["📦 Products<br/>Catalog, Detail"]
            CART["🛒 Cart<br/>Shopping Cart"]
            ORD["📋 Orders<br/>List/Detail"]
            ADM["👤 Admin<br/>Order Management"]
        end
        
        subgraph "Shared Module"
            HDR["🎨 Header Component"]
            CMP["📦 Shared Components"]
        end
    end
    
    GRD --> AUTH
    GRD --> PROD
    GRD --> CART
    GRD --> ORD
    GRD --> ADM
    
    SRV --> AUTH
    SRV --> PROD
    SRV --> CART
    SRV --> ORD
    
    style AUTH fill:#3498db,color:#fff
    style PROD fill:#3498db,color:#fff
    style CART fill:#3498db,color:#fff
    style ORD fill:#3498db,color:#fff
    style ADM fill:#3498db,color:#fff
```

### Frontend Veri Akışı (Signals ile)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant C as 🖥️ Component
    participant S as ⚙️ Service (Signals)
    participant I as 🔄 Interceptor
    participant A as 🔷 API
    
    U->>C: Action (Click, Submit)
    C->>S: Call Service Method
    S->>I: HTTP Request
    I->>I: Add Auth Token
    I->>A: API Request
    A-->>I: Response
    I-->>S: Parse Response
    S->>S: Update Signal
    S-->>C: Signal Effect
    C-->>U: UI Update
```

---

## 3. Laravel 12 Backend Mimarisi

```mermaid
graph TB
    subgraph "🔷 Laravel 12 Backend"
        subgraph "HTTP Layer"
            RC["🌐 Routes<br/>api.php"]
            MW["🛡️ Middleware<br/>License, Admin, Auth"]
            CT["📡 Controllers<br/>Auth, Product, Order, Cart, WMS, Admin"]
        end
        
        subgraph "Business Layer"
            SVC["⚙️ Services"]
            LS["License Service<br/>Phone-home validation"]
            US["Update Service<br/>Git-based updates"]
            WS["WMS Service<br/>Stock sync"]
        end
        
        subgraph "Data Layer"
            MDL["📊 Models<br/>User, Product, Order, etc."]
            MIG["🗄️ Migrations"]
        end
        
        subgraph "Queue Layer"
            JOB["⏳ Jobs<br/>WmsSyncStockJob"]
        end
    end
    
    RC --> MW
    MW --> CT
    CT --> SVC
    SVC --> LS
    SVC --> US
    SVC --> WS
    CT --> MDL
    SVC --> JOB
    
    style MW fill:#e74c3c,color:#fff
    style SVC fill:#27ae60,color:#fff
    style MDL fill:#f39c12,color:#fff
```

### Request Lifecycle

```mermaid
sequenceDiagram
    participant F as 🅰️ Frontend
    participant R as 🌐 Router
    participant M as 🛡️ Middleware
    participant C as 📡 Controller
    participant S as ⚙️ Service
    participant D as 🗄️ Database
    
    F->>R: HTTP Request
    R->>M: Route Match
    M->>M: License Check
    M->>M: Auth Check
    M->>C: Validated Request
    C->>S: Business Logic
    S->>D: Query/Mutation
    D-->>S: Result
    S-->>C: Processed Data
    C-->>F: JSON Response
```

---

## 4. Veritabanı Şeması

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CARTS : has
    USERS {
        bigint id PK
        string name
        string email UK
        string password
        enum role "admin,user"
        boolean is_active
        timestamp last_login
    }
    
    PRODUCTS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : includes
    PRODUCTS {
        bigint id PK
        string name
        text description
        string sku UK
        decimal price
        int stock_quantity
        bigint brand_id FK
        bigint category_id FK
        json images
        boolean is_active
    }
    
    BRANDS ||--o{ PRODUCTS : has
    BRANDS {
        bigint id PK
        string name UK
        string slug UK
        boolean is_active
    }
    
    CATEGORIES ||--o{ PRODUCTS : contains
    CATEGORIES ||--o{ CATEGORIES : parent
    CATEGORIES {
        bigint id PK
        string name
        string slug UK
        bigint parent_id FK
        boolean is_active
    }
    
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS {
        bigint id PK
        bigint user_id FK
        string order_number UK
        enum status "pending,approved,shipped,delivered,cancelled"
        decimal total_amount
        text shipping_address
        text notes
    }
    
    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal unit_price
    }
    
    CARTS ||--|{ CART_ITEMS : contains
    CARTS {
        bigint id PK
        bigint user_id FK
    }
    
    CART_ITEMS {
        bigint id PK
        bigint cart_id FK
        bigint product_id FK
        int quantity
    }
```

---

## 5. Lisans Doğrulama Akışı

```mermaid
flowchart TD
    A[🌐 HTTP Request] --> B{📋 License Cache Valid?}
    B -->|Yes| C[✅ Allow Request]
    B -->|No| D[📡 Phone Home to Provider]
    D --> E{🔍 License Valid?}
    E -->|Yes| F[💾 Cache License - 1h TTL]
    F --> C
    E -->|No| G{⏰ Grace Period?}
    G -->|Within 72h| H[⚠️ Warning + Allow]
    G -->|Expired| I[🚫 Block Access]
    D -->|Network Error| J{📶 Grace Period Active?}
    J -->|Yes| H
    J -->|No| I
    
    style C fill:#27ae60,color:#fff
    style H fill:#f39c12,color:#fff
    style I fill:#e74c3c,color:#fff
```

---

## 6. WMS Senkronizasyon Akışı

```mermaid
flowchart LR
    subgraph "🏭 WMS"
        WH[("Warehouse System")]
    end
    
    subgraph "🔷 Tenant App"
        WC["Webhook Controller"]
        WS["WMS Service"]
        JQ["Job Queue"]
        DB[("PostgreSQL")]
        MG[("MongoDB - Logs")]
    end
    
    WH -->|"Stock Update Webhook"| WC
    WC --> WS
    WS -->|"Create Job"| JQ
    JQ -->|"Batch Process 100"| DB
    JQ -->|"Log Failures"| MG
    
    DB -.->|"Scheduled Sync 5min"| WS
    WS -.->|"API Call"| WH
    
    style WH fill:#e74c3c,color:#fff
    style DB fill:#f39c12,color:#fff
    style MG fill:#2ecc71,color:#fff
```

---

## 7. Self-Update Mekanizması

```mermaid
sequenceDiagram
    participant A as 👤 Admin
    participant U as ⚙️ Update Service
    participant G as 📦 Git Repository
    participant S as 🔷 System
    
    A->>U: Check for Updates
    U->>G: git fetch
    G-->>U: Available Commits
    U-->>A: Update Available (v1.2.3)
    
    A->>U: Perform Update
    U->>S: Enable Maintenance Mode
    U->>G: git pull origin main
    
    alt Success
        U->>S: composer install
        U->>S: php artisan migrate
        U->>S: php artisan cache:clear
        U->>S: Disable Maintenance Mode
        U-->>A: ✅ Update Complete
    else Failure
        U->>G: git checkout HEAD~1
        U->>S: Disable Maintenance Mode
        U-->>A: ❌ Rollback Complete
    end
```

---

## 8. Dosya Yapısı

```
internetprogramlama/
├── 📦 tenant-app/                    # Laravel 12 Backend
│   ├── app/
│   │   ├── Enums/                   # OrderStatus, UserRole
│   │   ├── Http/
│   │   │   ├── Controllers/Api/     # 8 Controller
│   │   │   └── Middleware/          # LicenseMiddleware, AdminMiddleware
│   │   ├── Jobs/                    # WmsSyncStockJob
│   │   ├── Models/                  # 10 Eloquent Model
│   │   └── Services/
│   │       ├── License/             # Phone-home doğrulama
│   │       ├── Update/              # Self-update servisi
│   │       └── Wms/                 # WMS senkronizasyon
│   ├── config/
│   │   ├── license.php              # Lisans yapılandırması
│   │   └── wms.php                  # WMS yapılandırması
│   └── database/migrations/         # 12 migration dosyası
│
├── 🅰️ tenant-frontend/               # Angular 19 Frontend
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/              # authGuard, adminGuard
│   │   │   ├── interceptors/        # Auth, Error interceptors
│   │   │   ├── models/              # TypeScript interfaces
│   │   │   └── services/            # 5 servis (Signals ile)
│   │   ├── features/
│   │   │   ├── admin/               # Admin sipariş yönetimi
│   │   │   ├── auth/                # Login
│   │   │   ├── cart/                # Alışveriş sepeti
│   │   │   ├── orders/              # Sipariş listesi/detay
│   │   │   └── products/            # Ürün kataloğu
│   │   └── shared/components/       # Header
│   └── tailwind.config.js
│
├── 🐳 docker-compose.yml             # Tüm servislerin orkestasyonu
├── 🐳 Dockerfile                     # Laravel container imajı
└── 📚 memory_bank/                   # Proje dökümanları
```

---

## 9. Teknoloji Stack'i

| Katman | Teknoloji | Versiyon | Açıklama |
|--------|-----------|----------|----------|
| **Frontend** | Angular | 19 | Signals ile reaktif UI |
| **Styling** | TailwindCSS | 3.x | Utility-first CSS |
| **Backend** | Laravel | 12 | PHP API Framework |
| **Auth** | Sanctum | 4.x | SPA Token Authentication |
| **Database** | PostgreSQL | 16 | Ana veri deposu |
| **Logging** | MongoDB | 7.x | Log ve sync hataları |
| **Container** | Docker | 24.x | Konteynerizasyon |
| **Queue** | Redis/Database | - | Arkaplan görevleri |

---

## 10. Güvenlik Mimarisi

```mermaid
flowchart TB
    subgraph "🛡️ Security Layers"
        L1["Layer 1: HTTPS/TLS"]
        L2["Layer 2: CORS"]
        L3["Layer 3: Rate Limiting"]
        L4["Layer 4: Sanctum Auth"]
        L5["Layer 5: License Validation"]
        L6["Layer 6: Role-Based Access"]
        L7["Layer 7: Input Validation"]
    end
    
    L1 --> L2 --> L3 --> L4 --> L5 --> L6 --> L7
    
    L7 --> DB[("🗄️ Database")]
    
    style L1 fill:#3498db,color:#fff
    style L4 fill:#27ae60,color:#fff
    style L5 fill:#9b59b6,color:#fff
    style L6 fill:#e74c3c,color:#fff
```

---

> [!TIP]
> Bu diyagramlar Mermaid formatındadır ve GitHub, GitLab, Notion gibi platformlarda otomatik olarak render edilir.
