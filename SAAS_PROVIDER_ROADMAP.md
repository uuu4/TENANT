# 🏢 SaaS Provider - Multi-Repo Implementation Roadmap

> **Ayrı Proje Olarak:** `~/Desktop/saas-provider/`
> **Bağlantı:** Tenant App bu sisteme lisans doğrulaması için bağlanır

---

## 📁 Proje Yapısı

```
~/Desktop/
├── internetprogramlama/         # ✅ Mevcut Tenant Sistemi
│   ├── tenant-app/              # Laravel Backend (Port: 8000)
│   └── tenant-frontend/         # Angular Frontend (Port: 4200)
│
└── saas-provider/               # 🆕 Merkezi SaaS Yönetim Sistemi
    ├── backend/                 # Laravel 12 API (Port: 8001)
    ├── admin-frontend/          # Angular 19 Admin Panel (Port: 4201)
    ├── docker-compose.yml
    ├── README.md
    └── ARCHITECTURE.md
```

---

## 🎯 Phase 1: Backend API (Laravel 12)

### 1.1 Veritabanı Şeması

```
┌─────────────────────────────────────────────────────────────────┐
│                    SaaS Provider Database                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │   admins     │     │   tenants    │     │   licenses   │     │
│  ├──────────────┤     ├──────────────┤     ├──────────────┤     │
│  │ id           │     │ id           │     │ id           │     │
│  │ name         │     │ company_name │     │ license_key  │     │
│  │ email        │     │ domain       │     │ tenant_id    │──┐  │
│  │ password     │     │ contact_email│     │ plan         │  │  │
│  │ is_active    │     │ contact_phone│     │ status       │  │  │
│  │ created_at   │     │ address      │     │ starts_at    │  │  │
│  └──────────────┘     │ is_active    │     │ expires_at   │  │  │
│                       │ created_at   │◄────│ max_users    │──┘  │
│                       └──────────────┘     │ created_at   │     │
│                                            └──────────────┘     │
│                                                                  │
│  ┌──────────────────────┐     ┌──────────────────────┐          │
│  │ license_validations  │     │    app_versions      │          │
│  ├──────────────────────┤     ├──────────────────────┤          │
│  │ id                   │     │ id                   │          │
│  │ license_id           │     │ version              │          │
│  │ ip_address           │     │ release_notes        │          │
│  │ user_agent           │     │ git_tag              │          │
│  │ status               │     │ is_stable            │          │
│  │ response             │     │ released_at          │          │
│  │ validated_at         │     │ created_at           │          │
│  └──────────────────────┘     └──────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 API Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| **Tenant API (Lisans Doğrulama)** |||
| `POST` | `/api/license/validate` | Lisans doğrula | API Key |
| `GET` | `/api/license/{key}/info` | Lisans bilgisi | API Key |
| `GET` | `/api/updates/check` | Güncelleme kontrol | API Key |
| `GET` | `/api/updates/download/{version}` | Güncelleme indir | API Key |
| **Admin Panel API** |||
| `POST` | `/api/admin/auth/login` | Admin giriş | - |
| `POST` | `/api/admin/auth/logout` | Admin çıkış | Bearer |
| `GET` | `/api/admin/dashboard` | Dashboard istatistikleri | Bearer |
| `GET` | `/api/admin/tenants` | Tenant listesi | Bearer |
| `POST` | `/api/admin/tenants` | Yeni tenant ekle | Bearer |
| `PUT` | `/api/admin/tenants/{id}` | Tenant güncelle | Bearer |
| `DELETE` | `/api/admin/tenants/{id}` | Tenant sil | Bearer |
| `GET` | `/api/admin/licenses` | Lisans listesi | Bearer |
| `POST` | `/api/admin/licenses` | Yeni lisans oluştur | Bearer |
| `PUT` | `/api/admin/licenses/{id}` | Lisans güncelle | Bearer |
| `POST` | `/api/admin/licenses/{id}/revoke` | Lisans iptal et | Bearer |
| `POST` | `/api/admin/licenses/{id}/extend` | Lisans uzat | Bearer |
| `GET` | `/api/admin/validations` | Doğrulama logları | Bearer |
| `GET` | `/api/admin/versions` | Sürüm listesi | Bearer |
| `POST` | `/api/admin/versions` | Yeni sürüm yayınla | Bearer |

### 1.3 Lisans Doğrulama Akışı

```
┌─────────────────┐                              ┌─────────────────┐
│   Tenant App    │                              │  SaaS Provider  │
│   (Port 8000)   │                              │   (Port 8001)   │
└────────┬────────┘                              └────────┬────────┘
         │                                                │
         │  POST /api/license/validate                    │
         │  Headers: X-License-Key: TENANT-XXX            │
         │  Body: { domain, app_version, php_version }    │
         │ ─────────────────────────────────────────────► │
         │                                                │
         │                    ┌───────────────────────────┤
         │                    │ 1. License key kontrol    │
         │                    │ 2. Tenant aktif mi?       │
         │                    │ 3. Süre dolmuş mu?        │
         │                    │ 4. Doğrulama log kaydet   │
         │                    └───────────────────────────┤
         │                                                │
         │  Response: 200 OK                              │
         │  {                                             │
         │    "valid": true,                              │
         │    "license": {                                │
         │      "plan": "pro",                            │
         │      "max_users": 50,                          │
         │      "expires_at": "2025-12-31"                │
         │    },                                          │
         │    "update_available": true,                   │
         │    "latest_version": "1.2.0"                   │
         │  }                                             │
         │ ◄───────────────────────────────────────────── │
         │                                                │
```

---

## 🎨 Phase 2: Admin Panel (Angular 19)

### 2.1 Sayfa Yapısı

```
┌─────────────────────────────────────────────────────────────────┐
│  🏢 SaaS Provider Admin Panel                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 Dashboard                                                    │
│  ├── Aktif Tenant Sayısı                                        │
│  ├── Geçerli Lisans Sayısı                                      │
│  ├── Son 24 Saat Doğrulama                                      │
│  ├── Yakında Süresi Dolacak Lisanslar                           │
│  └── Grafik: Aylık Doğrulama Trendi                             │
│                                                                  │
│  🏭 Tenant Yönetimi                                              │
│  ├── Tenant Listesi (Tablo)                                     │
│  ├── Yeni Tenant Ekleme (Modal)                                 │
│  ├── Tenant Düzenleme (Modal)                                   │
│  └── Tenant Detay Sayfası                                       │
│                                                                  │
│  🔑 Lisans Yönetimi                                              │
│  ├── Lisans Listesi (Tablo + Filtre)                            │
│  ├── Lisans Oluşturma (Form)                                    │
│  ├── Lisans Uzatma (Quick Action)                               │
│  ├── Lisans İptal (Confirmation)                                │
│  └── Toplu İşlemler                                             │
│                                                                  │
│  📋 Loglar                                                       │
│  ├── Doğrulama Logları (Real-time)                              │
│  ├── Başarısız Girişimler                                       │
│  └── IP Bazlı Analiz                                            │
│                                                                  │
│  📦 Versiyon Yönetimi                                            │
│  ├── Mevcut Sürümler                                            │
│  ├── Yeni Sürüm Yayınlama                                       │
│  └── Rollback Seçenekleri                                       │
│                                                                  │
│  ⚙️ Ayarlar                                                      │
│  ├── Admin Profil                                               │
│  └── Sistem Konfigürasyonu                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Yapısı

```
admin-frontend/
└── src/app/
    ├── core/
    │   ├── guards/
    │   │   └── auth.guard.ts
    │   ├── interceptors/
    │   │   ├── auth.interceptor.ts
    │   │   └── error.interceptor.ts
    │   ├── models/
    │   │   ├── tenant.model.ts
    │   │   ├── license.model.ts
    │   │   ├── validation.model.ts
    │   │   └── version.model.ts
    │   └── services/
    │       ├── auth.service.ts
    │       ├── tenant.service.ts
    │       ├── license.service.ts
    │       ├── validation.service.ts
    │       └── version.service.ts
    │
    ├── features/
    │   ├── auth/
    │   │   └── login/
    │   ├── dashboard/
    │   │   └── dashboard.component.ts
    │   ├── tenants/
    │   │   ├── tenant-list/
    │   │   ├── tenant-detail/
    │   │   └── tenant-form/
    │   ├── licenses/
    │   │   ├── license-list/
    │   │   ├── license-form/
    │   │   └── license-actions/
    │   ├── validations/
    │   │   └── validation-logs/
    │   └── versions/
    │       ├── version-list/
    │       └── version-form/
    │
    └── shared/
        └── components/
            ├── sidebar/
            ├── header/
            ├── data-table/
            ├── modal/
            └── stats-card/
```

---

## 🔗 Phase 3: Entegrasyon

### 3.1 Tenant App Değişiklikleri

```php
// tenant-app/.env
LICENSE_PROVIDER_URL=http://localhost:8001/api
LICENSE_KEY=TENANT-XXXXXX-XXXXXX
```

### 3.2 Bağlantı Testi

```bash
# Terminal 1: SaaS Provider
cd ~/Desktop/saas-provider
php artisan serve --port=8001

# Terminal 2: Tenant App
cd ~/Desktop/internetprogramlama/tenant-app
php artisan serve --port=8000

# Test: Lisans doğrulama
curl -X POST http://localhost:8001/api/license/validate \
  -H "X-License-Key: TENANT-DEMO-123456" \
  -H "Content-Type: application/json" \
  -d '{"domain":"demo.example.com","app_version":"1.0.0"}'
```

---

## 📅 Implementation Timeline

| Faz | İş | Tahmini Süre | Deliverables |
|-----|-----|--------------|--------------|
| **1.1** | Laravel proje kurulum | 10 dk | Proje yapısı |
| **1.2** | Migrations + Models | 20 dk | 6 migration, 5 model |
| **1.3** | Lisans API endpoints | 20 dk | 4 endpoint |
| **1.4** | Admin API endpoints | 30 dk | 15 endpoint |
| **2.1** | Angular proje kurulum | 10 dk | Proje yapısı |
| **2.2** | Core modül (guards, services) | 20 dk | 5 service |
| **2.3** | Dashboard + Stats | 20 dk | 1 component |
| **2.4** | Tenant yönetimi UI | 25 dk | 3 component |
| **2.5** | Lisans yönetimi UI | 25 dk | 3 component |
| **2.6** | Loglar + Versiyonlar | 20 dk | 4 component |
| **3.1** | Tenant App entegrasyonu | 15 dk | Config değişiklikleri |
| **3.2** | End-to-end test | 15 dk | Doğrulama |
| | **TOPLAM** | **~3.5 saat** | |

---

## ✅ Checklist

### Phase 1: Backend
- [ ] Laravel 12 proje oluştur
- [ ] PostgreSQL veritabanı konfigürasyonu
- [ ] Migrations (admins, tenants, licenses, validations, versions)
- [ ] Eloquent Models
- [ ] License doğrulama servisi
- [ ] API Controllers
- [ ] Sanctum authentication
- [ ] API Routes

### Phase 2: Frontend
- [ ] Angular 19 proje oluştur
- [ ] Tailwind CSS konfigürasyonu
- [ ] Core modül (guards, interceptors, services)
- [ ] Auth modülü (login)
- [ ] Dashboard component
- [ ] Tenant yönetimi components
- [ ] Lisans yönetimi components
- [ ] Validation logs component
- [ ] Version management components

### Phase 3: Entegrasyon
- [ ] Tenant App LicenseMiddleware'i aktifleştir
- [ ] Environment değişkenlerini ayarla
- [ ] End-to-end test
- [ ] Docker Compose güncelle

---

## 🚀 Başlamaya Hazır mısın?

Bu yol haritasını onaylarsan aşağıdaki sırayla ilerleyeceğiz:

1. **saas-provider** klasörü oluştur (ayrı workspace olarak)
2. Laravel backend kurulumu
3. Database migrations
4. API implementation
5. Angular admin panel
6. Tenant App entegrasyonu
7. Test

**Onay ver, başlayalım!**
