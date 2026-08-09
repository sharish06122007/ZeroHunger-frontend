import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, query, stagger, group } from '@angular/animations';
import { AuthService } from '../../core/authentication/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('splashMaster', [
      transition(':enter', [
        group([
          query('.logo-glow-aura', [
            style({ opacity: 0, transform: 'scale(0.7)' }),
            animate('900ms 150ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
          ], { optional: true }),
          query('.title-badge', [
            style({ opacity: 0, transform: 'translateY(-12px)' }),
            animate('600ms 250ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
          ], { optional: true }),
          query('.letter-char', [
            style({ opacity: 0, transform: 'translateY(16px) scale(0.9)' }),
            stagger(35, [
              animate('380ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
            ]),
          ], { optional: true }),
          query('.hero-description', [
            style({ opacity: 0, transform: 'translateY(16px)' }),
            animate('600ms 550ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
          ], { optional: true }),
          query('.cta-buttons', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('650ms 700ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
          ], { optional: true }),
          query('.loading-card', [
            style({ opacity: 0, transform: 'translateY(24px) scale(0.96)' }),
            animate('700ms 850ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
  template: `
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-[var(--bg-main)] via-[var(--bg-surface)] to-[var(--bg-main)] text-[var(--text-main)] overflow-hidden p-6 sm:p-10 select-none" @splashMaster>
      
      <!-- Animated Radial Background Lighting -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/15 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--accent)]/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Top Header Badge -->
      <div class="relative z-10 pt-4 title-badge">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)]/80 text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/20 shadow-sm backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
          ZERO HUNGER. ZERO WASTE. 100% HOPE.
        </div>
      </div>

      <!-- Main Center Content Priority Block -->
      <div class="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-6 my-auto">
        <!-- ZeroHunger Centered Main Logo with Glow Aura -->
        <div class="logo-glow-aura relative flex justify-center items-center">
          <!-- Subtle natural glow behind the logo -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary)] via-[var(--primary-indigo)] to-[var(--accent)] opacity-20 blur-2xl scale-125 animate-pulse"></div>
          
          <!-- Exact ZeroHunger Logo Image -->
          <div class="relative w-32 h-32 flex items-center justify-center rounded-3xl overflow-hidden shadow-[var(--shadow-card)] ring-1 ring-[var(--primary)]/20 bg-[var(--bg-surface)] backdrop-blur-sm z-10">
            <img src="assets/images/logo.png" alt="ZeroHunger Logo" class="w-full h-full object-cover p-2" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzc0M2RiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMTAgMTAgMTAgMTAgMCAwIDAtMTAtMTBaIi8+PHBhdGggZD0iTTEyIDEydjQuNSIvPjxwaXRoIGQ9Ik0xMiAxNmguMDEiLz48L3N2Zz4='"/>
          </div>
        </div>

        <!-- Main Title ZEROHUNGER -->
        <div class="space-y-2">
          <div class="flex items-center justify-center gap-[1px]">
            @for (char of brandLetters; track $index) {
              <span class="letter-char font-black text-5xl sm:text-7xl tracking-tighter text-[var(--text-main)]">
                {{ char }}
              </span>
            }
          </div>

          <h2 class="text-sm sm:text-base font-bold text-[var(--primary)] tracking-wide mt-2">
            "Connecting Food. Supporting People. Building Hope."
          </h2>
        </div>

        <!-- Hero Description -->
        <p class="hero-description text-sm text-[var(--text-muted)] max-w-md leading-relaxed font-medium">
          Connect surplus food, caring communities, volunteers, NGOs, and homemade food makers to create a world with less hunger and less waste.
        </p>

        <!-- Action Buttons -->
        <div class="cta-buttons flex flex-wrap items-center justify-center gap-4 pt-2 w-full">
          <button (click)="proceedToApp()" class="btn-primary">
            Get Started
          </button>
          <button (click)="proceedToWelcome()" class="btn-secondary">
            Explore Impact
          </button>
        </div>

        <!-- Dynamic Loading Progress Card -->
        <div class="loading-card w-full max-w-sm mx-auto mt-6 p-4 rounded-[20px] space-y-3 bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-color)] shadow-[0_8px_30px_rgba(119,67,219,0.08)]">
          <div class="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full transition-all duration-300 ease-out"
              [style.width.%]="progress()"
            ></div>
          </div>

          <div class="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
            <span class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping"></span>
              {{ currentMessage }}
            </span>
            <span class="font-mono text-[var(--primary)] font-bold">{{ progress() }}%</span>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 text-center text-xs font-medium text-[var(--text-muted)] pb-2 tracking-wide">
        <span>ZeroHunger Platform</span>
        <span class="mx-2 text-[var(--primary)] opacity-50">•</span>
        <span>Premium Food Rescue</span>
      </div>
    </div>
  `,
})
export class SplashComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly brandLetters = ['Z', 'E', 'R', 'O', 'H', 'U', 'N', 'G', 'E', 'R'];
  readonly progress = signal(0);
  readonly currentMessageIndex = signal(0);

  readonly statusMessages = [
    'Connecting communities...',
    'Matching surplus meals...',
    'Routing local volunteers...',
    'Turning food into hope...',
    'Preparing your experience...',
  ];

  get currentMessage(): string {
    return this.statusMessages[this.currentMessageIndex()];
  }

  ngOnInit(): void {
    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current > 100) current = 100;
      this.progress.set(current);

      const msgIdx = Math.min(
        Math.floor((current / 100) * this.statusMessages.length),
        this.statusMessages.length - 1
      );
      this.currentMessageIndex.set(msgIdx);

      if (current >= 100) {
        clearInterval(interval);
      }
    }, 75);
  }

  proceedToApp(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  proceedToWelcome(): void {
    this.router.navigate(['/welcome']);
  }
}
