import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, AuthResponse, LoginRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly tokenKey = 'auth_token';

    // Signals for reactive state
    private userSignal = signal<User | null>(null);
    private loadingSignal = signal<boolean>(false);

    // Public computed signals
    readonly user = this.userSignal.asReadonly();
    readonly isAuthenticated = computed(() => this.userSignal() !== null);
    readonly isAdmin = computed(() => this.userSignal()?.is_admin ?? false);
    readonly loading = this.loadingSignal.asReadonly();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        this.loadingSignal.set(true);

        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                this.setToken(response.token);
                this.userSignal.set(response.user);
                this.loadingSignal.set(false);
            }),
            catchError(error => {
                this.loadingSignal.set(false);
                throw error;
            })
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
            tap(() => this.clearSession()),
            catchError(() => {
                this.clearSession();
                return of(null);
            })
        );
    }

    fetchProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/me`).pipe(
            tap(user => this.userSignal.set(user))
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    private clearSession(): void {
        localStorage.removeItem(this.tokenKey);
        this.userSignal.set(null);
        this.router.navigate(['/login']);
    }

    private loadUserFromStorage(): void {
        const token = this.getToken();
        if (token) {
            this.fetchProfile().subscribe({
                error: () => this.clearSession()
            });
        }
    }
}
