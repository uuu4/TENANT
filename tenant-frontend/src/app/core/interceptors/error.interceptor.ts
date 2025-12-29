import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Check if this is a protected API endpoint request
            const protectedEndpoints = ['/products', '/orders', '/cart', '/admin'];
            const isProtectedRequest = protectedEndpoints.some(endpoint => req.url.includes(endpoint));

            // Skip redirect for auth endpoints - these should fail silently
            const isAuthEndpoint = req.url.includes('/auth/');

            switch (error.status) {
                case 401:
                    // Unauthorized - clear token
                    localStorage.removeItem('auth_token');
                    // Only redirect if it's a protected endpoint request (not auth check)
                    if (isProtectedRequest && !isAuthEndpoint) {
                        router.navigate(['/login']);
                    }
                    break;
                case 402:
                    // License expired
                    router.navigate(['/license-expired']);
                    break;
                case 403:
                    // Forbidden - redirect to home if on protected route
                    if (isProtectedRequest) {
                        router.navigate(['/']);
                    }
                    break;
                case 500:
                    console.error('Server error:', error);
                    break;
            }

            return throwError(() => error);
        })
    );
};
