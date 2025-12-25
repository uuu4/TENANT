import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, tap, catchError, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExchangeRates {
    USD: number;
    EUR: number;
    lastUpdated: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ExchangeRateService {
    private readonly UPDATE_INTERVAL = 60000; // 1 minute

    private ratesSignal = signal<ExchangeRates>({
        USD: 34.50,
        EUR: 36.80,
        lastUpdated: new Date()
    });

    readonly rates = this.ratesSignal.asReadonly();

    constructor(private http: HttpClient) {
        this.startPolling();
    }

    private startPolling(): void {
        // Initial fetch
        this.fetchRates().subscribe();

        // Poll every minute
        interval(this.UPDATE_INTERVAL).pipe(
            switchMap(() => this.fetchRates())
        ).subscribe();
    }

    private fetchRates(): Observable<ExchangeRates> {
        // In production, this would call a real exchange rate API
        // For now, we'll simulate with slight variations
        return of({
            USD: 34.50 + (Math.random() - 0.5) * 0.2,
            EUR: 36.80 + (Math.random() - 0.5) * 0.2,
            lastUpdated: new Date()
        }).pipe(
            tap(rates => this.ratesSignal.set(rates)),
            catchError(() => of(this.ratesSignal()))
        );
    }

    convertToTRY(amount: number, currency: 'USD' | 'EUR'): number {
        const rates = this.ratesSignal();
        return amount * rates[currency];
    }
}
