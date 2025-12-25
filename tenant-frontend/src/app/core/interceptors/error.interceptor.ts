import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    // Unauthorized - redirect to login
                    localStorage.removeItem('auth_token');
                    router.navigate(['/login']);
                    break;
                case 402:
                    // License expired
                    router.navigate(['/license-expired']);
                    break;
                case 403:
                    // Forbidden
                    router.navigate(['/']);
                    break;
                case 500:
                    console.error('Server error:', error);
                    break;
            }

            return throwError(() => error);
        })
    );
};
