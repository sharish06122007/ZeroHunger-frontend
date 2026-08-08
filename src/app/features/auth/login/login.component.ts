import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { LucideAngularModule } from 'lucide-angular';
import { ZhInputComponent } from '../../../shared/components/ui/zh-input/zh-input.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, ZhInputComponent, ZhButtonComponent],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-brand-bg">
      <!-- Left Premium Hero Panel -->
      <div class="relative hidden lg:flex flex-col justify-between p-12 bg-brand-dark text-white overflow-hidden">
        <!-- Ambient Background -->
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-primary-light/20 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-accent/10 blur-3xl pointer-events-none"></div>
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200')] opacity-20 mix-blend-overlay object-cover"></div>

        <!-- Brand Top Bar -->
        <a routerLink="/" class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg">
            <lucide-icon name="home" class="w-6 h-6 text-white"></lucide-icon>
          </div>
          <span class="font-extrabold text-2xl tracking-tight text-white">Zero<span class="text-brand-primary-light">Hunger</span></span>
        </a>

        <!-- Hero Content -->
        <div class="relative z-10 space-y-8 max-w-lg mt-12">
          <div class="space-y-4">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-brand-primary-very-light border border-white/15 backdrop-blur-sm">
              <span class="w-2 h-2 rounded-full bg-brand-fresh"></span>
              Welcome back to our community
            </span>
            <h1 class="text-4xl font-extrabold tracking-tight leading-tight">
              Homemade Food.<br/>Stronger Community.
            </h1>
            <p class="text-sm text-brand-primary-very-light/80 leading-relaxed">
              Sign in to manage your food requests, connect with verified home food makers, or coordinate deliveries and impact activities.
            </p>
          </div>

          <!-- Trust Badge -->
          <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex items-start gap-4 mt-8">
             <div class="w-12 h-12 rounded-full bg-brand-primary/80 flex items-center justify-center shrink-0">
                <lucide-icon name="shield-check" class="text-white w-6 h-6"></lucide-icon>
             </div>
             <div>
               <p class="text-sm font-bold text-white mb-1">100% Secure & Verified</p>
               <p class="text-xs text-brand-primary-very-light/70 leading-relaxed">
                 Every member of our community is verified to ensure safety, trust, and the best quality homemade food experience.
               </p>
             </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="relative z-10 text-xs text-brand-primary-very-light/50 mt-12">
          © 2026 ZeroHunger. 100% Hope.
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="flex items-center justify-center p-6 sm:p-12" @slideIn>
        <div class="w-full max-w-md space-y-8">
          
          <!-- Mobile Brand (Visible only on small screens) -->
          <div class="lg:hidden text-center mb-8 flex flex-col items-center">
            <div class="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg mb-4">
              <lucide-icon name="home" class="w-6 h-6 text-white"></lucide-icon>
            </div>
            <h2 class="font-extrabold text-2xl tracking-tight text-brand-dark">Zero<span class="text-brand-primary">Hunger</span></h2>
          </div>

          <!-- Form Header -->
          <div class="space-y-2 text-center lg:text-left">
            <h2 class="text-3xl font-extrabold text-brand-text tracking-tight">Sign In</h2>
            <p class="text-sm text-brand-muted">Enter your details to access your account</p>
          </div>

          <!-- Login Form Card -->
          <div class="p-8 rounded-3xl shadow-float bg-white border border-brand-border space-y-6">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-2" novalidate>
              
              <app-zh-input
                formControlName="email"
                label="Email Address"
                placeholder="name@example.com"
                icon="mail"
                [error]="isInvalid('email') ? getError('email') : ''"
              ></app-zh-input>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-sm font-medium text-brand-text mb-1">Password</label>
                  <a routerLink="/auth/forgot-password" class="text-xs font-semibold text-brand-primary hover:underline">Forgot password?</a>
                </div>
                <app-zh-input
                  formControlName="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="••••••••"
                  icon="lock"
                  [error]="isInvalid('password') ? getError('password') : ''"
                ></app-zh-input>
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-12 mt-[-52px] text-brand-muted hover:text-brand-text text-xs font-semibold z-10 px-2 py-1"
                >
                  {{ showPassword() ? 'Hide' : 'Show' }}
                </button>
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <app-zh-button 
                  variant="primary" 
                  [fullWidth]="true" 
                  [loading]="isLoading()"
                  type="submit"
                >
                  Sign In
                </app-zh-button>
              </div>
            </form>

            <div class="relative flex items-center justify-center my-6">
              <div class="border-t border-brand-border w-full"></div>
              <span class="bg-white px-3 text-[11px] font-bold text-brand-muted uppercase tracking-wider relative">or</span>
            </div>

            <p class="text-center text-sm text-brand-muted">
              Don't have an account yet?
              <a routerLink="/auth/register" class="font-bold text-brand-primary hover:underline ml-1">Create one</a>
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
    const submittedEmail = (email ?? '').trim().toLowerCase();

    this.authService.login({ email: submittedEmail, password: password! }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toast.success('Welcome back!', `Hello, ${res.data.user.fullName}`);
        this.router.navigate(['/zerohunger-loader']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const message = err.message || 'Login failed';

        if (message.toLowerCase().includes('verify')) {
          this.toast.error('Email verification required', 'Please verify your email to continue.');
          this.router.navigate(['/auth/verify-email'], { queryParams: { email: submittedEmail } });
          return;
        }

        this.toast.error('Login failed', message);
      },
    });
  }
}
