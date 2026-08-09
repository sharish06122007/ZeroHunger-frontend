import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-6 relative overflow-hidden">
      <!-- Ambient Orbs -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--primary)]/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--accent)]/20 blur-3xl pointer-events-none"></div>

      <div class="zh-card max-w-md w-full p-8 sm:p-10 relative z-10 text-center" @fadeIn>
        <!-- Step 1: Request Reset OTP -->
        @if (step() === 'request') {
          <div class="space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center text-3xl">🔑</div>
            <div class="space-y-1">
              <h1 class="text-2xl font-extrabold text-[var(--text-main)]">Forgot Password?</h1>
              <p class="text-xs text-[var(--text-muted)]">Enter your registered email to receive a password reset OTP</p>
            </div>
            <form [formGroup]="emailForm" (ngSubmit)="onRequestOtp()" class="space-y-4 text-left">
              <div class="form-group">
                <label class="zh-label" for="email">Work Email</label>
                <input id="email" type="email" class="zh-input" formControlName="email" placeholder="name@organization.com" />
              </div>
              <button type="submit" [disabled]="isLoading()" class="btn-primary w-full">
                @if (isLoading()) {
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending OTP...</span>
                } @else {
                  <span>Send Reset OTP →</span>
                }
              </button>
            </form>
          </div>
        }

        <!-- Step 2: Verify OTP -->
        @if (step() === 'otp') {
          <div class="space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center text-3xl">📩</div>
            <div class="space-y-1">
              <h1 class="text-2xl font-extrabold text-[var(--text-main)]">Enter Reset OTP</h1>
              <p class="text-xs text-[var(--text-muted)]">Code sent to <strong class="text-[var(--primary)]">{{ resetEmail() }}</strong></p>
            </div>
            <form [formGroup]="otpForm" (ngSubmit)="onVerifyOtp()" class="space-y-4 text-left">
              <div class="form-group">
                <label class="zh-label" for="otp">6-Digit Code</label>
                <input id="otp" type="text" maxlength="6" class="zh-input text-center font-bold text-lg tracking-widest" formControlName="otp" placeholder="123456" />
              </div>
              <button type="submit" [disabled]="isLoading()" class="btn-primary w-full">
                @if (isLoading()) {
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying...</span>
                } @else {
                  <span>Verify Reset Code →</span>
                }
              </button>
            </form>
          </div>
        }

        <!-- Step 3: New Password -->
        @if (step() === 'reset') {
          <div class="space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center text-3xl">🔒</div>
            <div class="space-y-1">
              <h1 class="text-2xl font-extrabold text-[var(--text-main)]">Set New Password</h1>
              <p class="text-xs text-[var(--text-muted)]">Create a new secure password for your account</p>
            </div>
            <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()" class="space-y-4 text-left">
              <div class="form-group">
                <label class="zh-label" for="newPw">New Password</label>
                <input id="newPw" type="password" class="zh-input" formControlName="newPassword" placeholder="Minimum 6 characters" />
              </div>
              <button type="submit" [disabled]="isLoading()" class="btn-primary w-full">
                @if (isLoading()) {
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Resetting...</span>
                } @else {
                  <span>Reset Password & Sign In 🎉</span>
                }
              </button>
            </form>
          </div>
        }

        <div class="pt-4 border-t border-[var(--border-color)]">
          <a routerLink="/auth/login" class="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]">← Back to Sign In</a>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly step = signal<'request' | 'otp' | 'reset'>('request');
  readonly isLoading = signal(false);
  readonly resetEmail = signal('');
  readonly resetToken = signal('');

  readonly emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  onRequestOtp(): void {
    if (this.emailForm.invalid) return;
    this.isLoading.set(true);
    const email = this.emailForm.value.email!;
    this.resetEmail.set(email);

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.info('OTP Sent', `Verification code sent to ${email}`);
        this.step.set('otp');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Failed', err.message);
      },
    });
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) return;
    this.isLoading.set(true);

    this.authService.verifyOtp(this.resetEmail(), this.otpForm.value.otp!).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.resetToken.set(res.data.resetToken);
        this.toast.success('Code Verified', 'Please enter your new password.');
        this.step.set('reset');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Verification Failed', err.message);
      },
    });
  }

  onResetPassword(): void {
    if (this.resetForm.invalid) return;
    this.isLoading.set(true);

    this.authService.resetPassword(this.resetEmail(), this.resetToken(), this.resetForm.value.newPassword!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Password Reset!', 'Please login with your new password.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Reset Failed', err.message);
      },
    });
  }
}
