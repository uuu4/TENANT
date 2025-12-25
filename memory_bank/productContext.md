# Product Context

## Purpose
A distributed B2B e-commerce SaaS platform enabling businesses to run their own fully-isolated online B2B stores with WMS integration, license management, and self-update capabilities. Solves the problem of B2B companies needing a professional e-commerce solution with real-time stock sync.

## Target Users
- **Tenant Admins**: Business owners managing brands, users, campaigns, order approvals
- **Tenant Users**: Business customers browsing products, placing orders, tracking shipments
- **SaaS Provider**: Manages licenses, distributes updates across all tenants

## User Stories
- **As a Tenant Admin**, I want to approve pending orders so that I can control order flow
- **As a Tenant Admin**, I want to trigger system updates so that I get new features safely
- **As a Tenant User**, I want to filter products by brand/category/OEM so that I find items quickly
- **As a Tenant User**, I want to see real-time stock levels so that I know availability
- **As a Tenant User**, I want to view prices in USD/EUR so that I can make informed decisions

## Business Rules
- Orders require admin approval before processing
- License validation required on every API request (with 72h grace period)
- Stock syncs every 5 minutes + real-time webhook updates
- Campaigns can be percentage, fixed discount, or buy-x-get-y
- Exchange rates displayed live in header (USD/EUR)

## Success Metrics
- **License Compliance**: 100% of tenant requests validated
- **Sync Reliability**: <1% sync failures per month
- **Update Success Rate**: >99% successful self-updates
- **User Experience**: <2s page load time with cached stock data

---
*Son güncelleme: 2025-12-24*
