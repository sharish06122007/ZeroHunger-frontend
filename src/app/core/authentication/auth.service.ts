// core/authentication/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { User, UserRole, ApiResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface AuthData {
  user: User;
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'zh_access_token';
  private readonly USER_KEY = 'zh_user';

  // Angular Signals for reactive state
  private readonly _currentUser = signal<User | null>(this.loadStoredUser());
  private readonly _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser() && !!this.accessToken);
  readonly userRole = computed(() => this._currentUser()?.role);

  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  get accessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  register(data: {
    fullName: string; email: string; phone: string;
    password: string; confirmPassword: string; role: UserRole; organizationName?: string;
  }): Observable<ApiResponse<{ email: string }>> {
    return this.http.post<ApiResponse<{ email: string }>>(`${this.apiUrl}/register`, data, { withCredentials: true }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Registration failed')))
    );
  }

  verifyEmail(email: string, otp: string): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/verify-email`, { email, otp }, { withCredentials: true }).pipe(
      tap(res => { if (res.success && res.data) this.persistSession(res.data.user, res.data.accessToken); }),
      catchError(err => throwError(() => new Error(err.error?.message || 'Verification failed')))
    );
  }

  resendOtp(email: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.apiUrl}/resend-otp`, { email }, { withCredentials: true }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Failed to resend OTP')))
    );
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(res => { if (res.success && res.data) this.persistSession(res.data.user, res.data.accessToken); }),
      catchError(err => throwError(() => new Error(err.error?.message || 'Login failed')))
    );
  }

  refreshToken(): Observable<ApiResponse<{ accessToken: string }>> {
    return this.http.post<ApiResponse<{ accessToken: string }>>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && res.data?.accessToken) {
          localStorage.setItem(this.TOKEN_KEY, res.data.accessToken);
        }
      }),
      catchError(err => {
        this.clearSession();
        return throwError(() => new Error('Session expired'));
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.apiUrl}/forgot-password`, { email }, { withCredentials: true }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Request failed')))
    );
  }

  verifyOtp(email: string, otp: string): Observable<ApiResponse<{ resetToken: string }>> {
    return this.http.post<ApiResponse<{ resetToken: string }>>(`${this.apiUrl}/verify-otp`, { email, otp }, { withCredentials: true }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'OTP verification failed')))
    );
  }

  resetPassword(email: string, resetToken: string, newPassword: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.apiUrl}/reset-password`, { email, resetToken, newPassword }, { withCredentials: true }).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Password reset failed')))
    );
  }

  updateProfile(data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/me`, data, { withCredentials: true }).pipe(
      tap(res => { if (res.success && res.data) { this._currentUser.set(res.data); this.saveUser(res.data); } }),
      catchError(err => throwError(() => new Error(err.error?.message || 'Profile update failed')))
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this._currentUser()?.role;
    return !!role && roles.includes(role);
  }

  private persistSession(user: User, token: string): void {
    const normalizedUser = { ...user, id: user.id || user._id || '' };
    this._currentUser.set(normalizedUser);
    localStorage.setItem(this.TOKEN_KEY, token);
    this.saveUser(normalizedUser);
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private loadStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    this._currentUser.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
