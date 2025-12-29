import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, CartService, ExchangeRateService } from '../../../core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">B2B</span>
              </div>
              <span class="text-xl font-bold text-gray-900">TenantApp</span>
            </a>
          </div>

          <!-- Exchange Rates -->
          <div class="hidden md:flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">USD/TRY</span>
              <span class="font-semibold text-green-600">{{ rates().USD | number:'1.2-2' }}</span>
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">EUR/TRY</span>
              <span class="font-semibold text-blue-600">{{ rates().EUR | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <a routerLink="/" 
               class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Ana Sayfa
            </a>
            <a routerLink="/news" 
               class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Haberler
            </a>
            <a routerLink="/info" 
               class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Hakkımızda
            </a>
            @if (isAuthenticated()) {
              <a routerLink="/products" 
                 class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                Ürünler
              </a>
              <a routerLink="/orders" 
                 class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                Siparişler
              </a>
              @if (isAdmin()) {
                <a routerLink="/admin" 
                   class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Admin
                </a>
              }
            }
          </nav>

          <!-- Cart & User -->
          <div class="flex items-center gap-4">
            @if (isAuthenticated()) {
              <!-- Cart - Hide for Admin -->
              @if (!isAdmin()) {
                <a routerLink="/cart" 
                   class="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v6a1 1 0 001 1h8a1 1 0 001-1v-6M9 21h6"/>
                  </svg>
                  @if (cartItemCount() > 0) {
                    <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs 
                                 rounded-full flex items-center justify-center font-medium">
                      {{ cartItemCount() }}
                    </span>
                  }
                </a>
              }

              <!-- User Menu -->
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-medium text-sm">
                    {{ user()?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
                <span class="hidden lg:block text-sm text-gray-700">{{ user()?.name }}</span>
                <button (click)="logout()" 
                        class="ml-2 text-gray-500 hover:text-red-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </button>
              </div>
            } @else {
              <a routerLink="/login" class="btn-primary">
                Giriş Yap
              </a>
            }
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private exchangeRateService = inject(ExchangeRateService);

  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;
  isAdmin = this.authService.isAdmin;
  cartItemCount = this.cartService.itemCount;
  rates = this.exchangeRateService.rates;

  logout(): void {
    this.authService.logout().subscribe();
  }
}

