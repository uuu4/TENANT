# Project Brief

## Project Name
Distributed B2B SaaS Platform

## Description
A distributed B2B e-commerce SaaS platform where each tenant (customer) has their own isolated hosting environment, custom domain (e.g., `customer-a.com`), and database. A central SaaS Provider (`provider.com`) manages licenses and updates.

## Goals
- Build a distributed, licensable B2B e-commerce platform
- Enable WMS (Warehouse Management System) integration for real-time stock/price sync
- Provide self-update mechanism via git for tenant applications
- Support multi-currency (USD/EUR) with live exchange rates

## Tech Stack
- **Backend:** PHP Laravel 12 (PHP 8.4+)
- **Frontend:** Angular (Latest) with Standalone Components & Signals
- **Styling:** Tailwind CSS
- **Main Database:** PostgreSQL (Transactional data)
- **Log Database:** MongoDB (Audit logs, Events)
- **Architecture:** Distributed Instances (One codebase, multiple servers)

## Key Features
- "Phone Home" license validation with grace period
- WMS synchronization (Webhook + Scheduled jobs)
- Self-update command (git pull + migrations)
- Tenant Admin: Brands, campaigns, order approvals, user management
- Tenant User: Product browsing, cart, orders with filters (OEM, Brand, Category)

---
*Son güncelleme: 2025-12-24*
