import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

      <div class="zh-card max-w-md w-full p-8 sm:p-10 text-center space-y-6 relative z-10" @fadeIn>
        <!-- Icon Capsule -->
        <div class="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center text-3xl shadow-inner">
          📩
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-extrabold text-[var(--text-main)]">Verify Your Email</h1>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            Enter the 6-digit verification code sent to<br>
            <strong class="text-[var(--primary)] font-bold">{{ email() || 'your email' }}</strong>
          </p>
        </div>

        <form (ngSubmit)="onVerify()" class="space-y-6">
          <div class="flex gap-2 justify-center" (paste)="onPaste($event)">
            @for (digit of otpDigits; track $index; let i = $index) {
              <input
                [id]="'otp-' + i"
                type="text"
                maxlength="1"
                class="w-11 h-14 text-center font-bold text-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:bg-white focus:outline-none transition-all"
                [class.border-primary]="otpDigits[i]"
                [(ngModel)]="otpDigits[i]"
                [name]="'digit-' + i"
                (keyup)="onDigitKeyUp($event, i)"
                (keydown)="onDigitKeyDown($event, i)"
                autocomplete="off"
              />
            }
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            [disabled]="isLoading() || !isComplete()"
          >
            @if (isLoading()) {
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Verifying Code...</span>
            } @else {
              <span>Verify & Continue →</span>
            }
          </button>
        </form>

        <div class="space-y-2 pt-2 border-t border-[var(--border-color)]">
          @if (resendTimer() > 0) {
            <p class="text-xs text-[var(--text-muted)]">Resend code in <strong class="text-[var(--primary)] font-mono">{{ resendTimer() }}s</strong></p>
          } @else {
            <button
              type="button"
              (click)="onResend()"
              [disabled]="isResending()"
              class="text-xs font-bold text-[var(--primary)] hover:underline"
            >
              @if (isResending()) { Resending Code... } @else { Resend OTP Code }
            </button>
          }
        </div>

        <div>
          <a routerLink="/auth/register" class="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]">← Change Email Address</a>
        </div>
      </div>
    </div>
  `,
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly email = signal('');
  readonly isLoading = signal(false);
  readonly isResending = signal(false);
  readonly resendTimer = signal(60);

  otpDigits = ['', '', '', '', '', ''];
  private intervalId: any;

  ngOnInit(): void {
    const emailParam = this.route.snapshot.queryParams['email'];
    if (emailParam) {
      this.email.set(emailParam);
    }
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startTimer(): void {
    this.resendTimer.set(60);
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.resendTimer() > 0) {
        this.resendTimer.update(t => t - 1);
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  isComplete(): boolean {
    return this.otpDigits.every(d => d.trim().length === 1);
  }

  onDigitKeyUp(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
    if (this.isComplete()) {
      this.onVerify();
    }
  }

  onDigitKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').trim() || '';
    if (/^\d{6}$/.test(pasted)) {
      pasted.split('').forEach((char, i) => {
        this.otpDigits[i] = char;
      });
      if (this.isComplete()) this.onVerify();
    }
  }

  onVerify(): void {
    if (!this.isComplete()) return;

    this.isLoading.set(true);
    const otp = this.otpDigits.join('');

    this.authService.verifyEmail(this.email(), otp).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Email Verified!', 'Your account is ready. Let\'s set up your profile.');
        this.router.navigate(['/auth/profile-setup']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Verification Failed', err.message);
      },
    });
  }

  onResend(): void {
    this.isResending.set(true);
    this.authService.resendOtp(this.email()).subscribe({
      next: () => {
        this.isResending.set(false);
        this.toast.info('OTP Sent', 'A new verification code has been sent to your email.');
        this.startTimer();
      },
      error: (err) => {
        this.isResending.set(false);
        this.toast.error('Resend Failed', err.message);
      },
    });
  }
}
