# System Patterns

## Design Patterns Used
- **Repository Pattern**: Data access abstraction for Products, Orders
- **Service Layer**: Business logic isolation (LicenseService, WmsService)
- **Job/Queue Pattern**: Async processing for WMS sync, webhooks
- **Circuit Breaker**: WMS API fallback to local PostgreSQL
- **Cache-Aside**: License status and stock data caching
- **Middleware Chain**: Request filtering (Auth, License, Admin)

## Coding Conventions

### PHP/Laravel
- **Naming**: PascalCase for classes, camelCase for methods/variables
- **File Structure**: Feature-based organization in Services/
- **Strict Typing**: `declare(strict_types=1)` in all files
- **Final Classes**: Use `final` for non-extensible classes
- **Readonly Properties**: PHP 8.4 readonly class properties

### Angular/TypeScript
- **Naming**: kebab-case files, PascalCase components, camelCase methods
- **Standalone Components**: No NgModule usage
- **Signals**: Reactive state management
- **Typed Forms**: Strict form typing

### Tailwind CSS
- **Utility-First**: Direct utility classes in templates
- **Dark Mode**: `dark:` prefix for dark theme variants
- **Responsive**: `sm:`, `md:`, `lg:` breakpoint prefixes

## Common Components
- `LicenseMiddleware`: Phone-home validation with grace period
- `WmsSyncJob`: 5-minute scheduled stock/price sync
- `ProductFilter`: Sidebar filter with brand, category, OEM search
- `ExchangeRateService`: Live USD/EUR rates in header

## Error Handling
- **License Expired**: 402 Payment Required + redirect to error page
- **WMS Down**: Serve cached PostgreSQL data, log to MongoDB
- **Invalid WMS Data**: Skip invalid records, continue processing
- **Update Failed**: Rollback to backup ref, notify admin

## Security Patterns
- **License Validation**: Server-side middleware check on every request
- **Webhook Signatures**: Validate WMS webhook authenticity
- **CSRF/XSS Protection**: Laravel built-in + Angular HttpClient
- **Rate Limiting**: API endpoints protected against abuse
- **Maintenance Mode**: Secret bypass for admins during updates

---
*Son güncelleme: 2025-12-24*
