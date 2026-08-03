import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FFFBF5]">
      <!-- Left Premium Hero Panel -->
      <div class="relative hidden lg:flex flex-col justify-between p-12 bg-[#1A1A1A] text-white overflow-hidden">
        <!-- Ambient Purple Orbs -->
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7743DB]/30 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#C3ACD0]/20 blur-3xl pointer-events-none"></div>

        <!-- Brand Top Bar -->
        <a routerLink="/" class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7743DB] via-[#9055EE] to-[#C3ACD0] p-0.5 shadow-lg">
            <div class="w-full h-full bg-[#1A1A1A] rounded-[14px] flex items-center justify-center font-black text-[#C3ACD0]">
              ZH
            </div>
          </div>
          <span class="font-extrabold text-xl tracking-tight text-white">Zero<span class="text-[#C3ACD0]">Hunger</span></span>
        </a>

        <!-- Hero Content & Impact Card -->
        <div class="relative z-10 space-y-8 max-w-lg">
          <div class="space-y-4">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#C3ACD0] border border-white/15">
              <span class="w-2 h-2 rounded-full bg-[#22C55E]"></span>
              Trusted by 500+ Enterprises & NGOs
            </span>
            <h1 class="text-4xl font-extrabold tracking-tight leading-tight">
              Empowering Real-Time Food Rescue Network
            </h1>
            <p class="text-sm text-slate-300 leading-relaxed">
              Connect commercial kitchens, courier networks, and local shelters with real-time dispatch, route optimization, and verified distribution logs.
            </p>
          </div>

          <!-- Glass Testimonial Card -->
          <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 shadow-2xl">
            <p class="text-xs italic text-slate-200 leading-relaxed">
              "ZeroHunger reduced our surplus pickup turnaround to under 20 minutes. It's the most reliable food logistics platform we've deployed."
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-white/10">
              <div class="w-8 h-8 rounded-xl bg-[#7743DB] text-white font-bold text-xs flex items-center justify-center">
                RK
              </div>
              <div>
                <p class="text-xs font-bold text-white">Chef Ramesh Kumar</p>
                <span class="text-[10px] text-[#C3ACD0]">Taj Palace Operations</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="relative z-10 text-xs text-slate-400">
          © 2026 ZeroHunger Inc. Enterprise SaaS Platform.
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="flex items-center justify-center p-6 sm:p-12" @slideIn>
        <div class="w-full max-w-md space-y-8">
          <!-- Form Header -->
          <div class="space-y-2 text-center lg:text-left">
            <h2 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Welcome Back</h2>
            <p class="text-sm text-[#5B5B6A]">Sign in to manage food rescue operations and donations</p>
          </div>

          <!-- Login Form Card -->
          <div class="glass-panel p-8 rounded-3xl shadow-xl border border-[#E8DDD3] bg-white/90 space-y-6">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
              <!-- Email Input -->
              <div class="form-group">
                <label class="form-label" for="email">Email Address <span class="text-rose-500">*</span></label>
                <input
                  id="email"
                  type="email"
                  class="input-field"
                  [class.border-rose-400]="isInvalid('email')"
                  formControlName="email"
                  placeholder="name@organization.org"
                  autocomplete="email"
                />
                @if (isInvalid('email')) {
                  <p class="text-xs text-rose-500 mt-1 font-medium">{{ getError('email') }}</p>
                }
              </div>

              <!-- Password Input -->
              <div class="form-group">
                <div class="flex justify-between items-center mb-1">
                  <label class="form-label mb-0" for="password">Password <span class="text-rose-500">*</span></label>
                  <a routerLink="/auth/forgot-password" class="text-xs font-semibold text-[#7743DB] hover:underline">Forgot password?</a>
                </div>
                <div class="relative">
                  <input
                    id="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    class="input-field pr-10"
                    [class.border-rose-400]="isInvalid('password')"
                    formControlName="password"
                    placeholder="••••••••••••"
                    autocomplete="current-password"
                  />
                  <button
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B5B6A] hover:text-[#1A1A1A] text-xs font-semibold"
                  >
                    {{ showPassword() ? 'Hide' : 'Show' }}
                  </button>
                </div>
                @if (isInvalid('password')) {
                  <p class="text-xs text-rose-500 mt-1 font-medium">{{ getError('password') }}</p>
                }
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn-primary w-full py-3.5 text-sm font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30"
                [disabled]="isLoading()"
              >
                @if (isLoading()) {
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Signing In...</span>
                } @else {
                  <span>Sign In to Dashboard →</span>
                }
              </button>
            </form>

            <div class="relative flex items-center justify-center my-4">
              <div class="border-t border-[#E8DDD3] w-full"></div>
              <span class="bg-white px-3 text-[11px] font-bold text-[#5B5B6A] uppercase tracking-wider relative">or</span>
            </div>

            <p class="text-center text-xs text-[#5B5B6A]">
              Don't have an enterprise account?
              <a routerLink="/auth/register" class="font-bold text-[#7743DB] hover:underline ml-1">Create one free →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly showPassword = signal(false);
  readonly isLoading = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  isInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }

  getError(field: string): string {
    const ctrl = this.loginForm.get(field);
    if (ctrl?.hasError('required')) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    if (ctrl?.hasError('email')) return 'Please enter a valid email address';
    if (ctrl?.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toast.success('Welcome back!', `Hello, ${res.data.user.fullName}`);
        this.router.navigate(['/zerohunger-loader']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Login failed', err.message);
      },
    });
  }
}
