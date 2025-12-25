# Product Context

## Purpose
A distributed B2B e-commerce SaaS platform enabling businesses to run their own fully-isolated online B2B stores with WMS integration, license management, and self-update capabilities. Solves the problem of B2B companies needing a professional e-commerce solution with real-time stock sync.

## System Components

### 1. Tenant App (COMPLETE ✅)
- **Location:** `~/Desktop/internetprogramlama/`
- **Backend:** Laravel 12 API (Port 8000)
- **Frontend:** Angular 19 SPA (Port 4200)
- **Status:** Fully functional, tested, deployed to GitHub

### 2. SaaS Provider (NEXT 🔜)
- **Location:** `~/Desktop/saas-provider/`
- **Backend:** Laravel 12 API (Port 8001)
- **Admin Panel:** Angular 19 (Port 4201)
- **Status:** Roadmap created, ready for implementation

## Target Users
- **Tenant Admins**: Business owners managing brands, users, campaigns, order approvals
- **Tenant Users**: Business customers browsing products, placing orders, tracking shipments
- **SaaS Provider Admins**: Manage licenses, tenants, distribute updates

## User Stories
- **As a Tenant Admin**, I want to approve pending orders so that I can control order flow ✅
- **As a Tenant Admin**, I want to trigger system updates so that I get new features safely
- **As a Tenant User**, I want to filter products by brand/category/OEM so that I find items quickly ✅
- **As a Tenant User**, I want to see real-time stock levels so that I know availability ✅
- **As a Tenant User**, I want to view prices in USD/EUR so that I can make informed decisions ✅
- **As a SaaS Admin**, I want to manage tenant licenses so that I can control access
- **As a SaaS Admin**, I want to see validation logs so that I can monitor system health

## Business Rules
- Orders require admin approval before processing ✅
- License validation required on every API request (with 72h grace period)
- Stock syncs every 5 minutes + real-time webhook updates
- Campaigns can be percentage, fixed discount, or buy-x-get-y
- Exchange rates displayed live in header (USD/EUR) ✅

## Tested Flows
1. ✅ User login/logout (Sanctum tokens)
2. ✅ Product listing with filters (brand, category, search)
3. ✅ Stock status display (In Stock / Out of Stock)
4. ✅ Add to cart
5. ✅ Place order (becomes Pending Approval)
6. ✅ Admin sees pending orders with Approve button

## Success Metrics
- **License Compliance**: 100% of tenant requests validated
- **Sync Reliability**: <1% sync failures per month
- **Update Success Rate**: >99% successful self-updates
- **User Experience**: <2s page load time with cached stock data

## GitHub Repository
- **URL:** https://github.com/uuu4/potential-train
- **Branch:** main

---
*Last updated: 2025-12-25 15:50*
