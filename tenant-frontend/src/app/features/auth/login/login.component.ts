import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl 
                      flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-2xl">B2B</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p class="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <!-- Error Message -->
        @if (error()) {
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ error() }}</p>
          </div>
        }

        <!-- Login Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              class="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full btn-primary py-3 disabled:opacity-50">
            @if (loading()) {
              <span class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            }
            Sign In
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            Distributed B2B SaaS Platform
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    loading = signal(false);
    error = signal<string | null>(null);

    onSubmit(): void {
        if (!this.email || !this.password) {
            this.error.set('Please enter email and password');
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.router.navigate(['/products']);
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message || 'Invalid credentials');
            }
        });
    }
}
