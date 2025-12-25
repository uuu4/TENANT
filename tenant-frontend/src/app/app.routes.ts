import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent)
            },
            {
                path: ':id',
                loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
            }
        ]
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        children: [
            {
                path: '',
                redirectTo: 'orders',
                pathMatch: 'full'
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent)
            }
        ]
    },
    {
        path: 'license-expired',
        loadComponent: () => import('./features/license-expired/license-expired.component').then(m => m.LicenseExpiredComponent)
    },
    {
        path: '**',
        redirectTo: 'products'
    }
];
