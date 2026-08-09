import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, query, stagger, group } from '@angular/animations';
import { AuthService } from '../../../core/authentication/auth.service';
import { FallingFoodBackgroundComponent } from '../../../shared/components/falling-food/falling-food-background/falling-food-background.component';

@Component({
  selector: 'app-login-transition',
  standalone: true,
  imports: [CommonModule, FallingFoodBackgroundComponent],
  animations: [
    trigger('loginMaster', [
      transition(':enter', [
        group([
          query('.logo-glow', [
            style({ opacity: 0, transform: 'scale(0.5)' }),
            animate('800ms 100ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
          ], { optional: true }),
          query('.title-text', [
            style({ opacity: 0, transform: 'translateY(16px)' }),
            animate('600ms 200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
          ], { optional: true }),
          query('.progress-card', [
            style({ opacity: 0, transform: 'translateY(24px) scale(0.95)' }),
            animate('700ms 300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
  template: `
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[var(--bg-main)] via-[var(--bg-surface)] to-[var(--bg-main)] text-[var(--text-main)] overflow-hidden p-6 sm:p-10 select-none" @loginMaster>
      <!-- Falling Food Canvas Background -->
      <app-falling-food-background></app-falling-food-background>

      <!-- Ambient Soft Blurs -->
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--success)]/05 blur-[140px] pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/05 blur-[140px] pointer-events-none"></div>

      <!-- Top Header Badge -->
      <div class="relative z-10 pt-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)]/80 text-xs font-bold text-[var(--success)] border border-[var(--success)]/20 shadow-md backdrop-blur-md">
          <span class="w-2.5 h-2.5 rounded-full bg-[var(--success)] animate-pulse"></span>
          AUTHENTICATION SUCCESSFUL • INITIALIZING SESSION
        </div>
      </div>

      <!-- Center Logo & Title Block -->
      <div class="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-6 my-auto">
        <!-- Logo Capsule -->
        <div class="logo-glow relative group">
          <div class="w-28 h-28 rounded-3xl bg-[var(--bg-surface)] border border-[var(--success)]/30 flex items-center justify-center shadow-xl shadow-[var(--success)]/10">
            <span class="text-5xl">🍱</span>
          </div>
        </div>

        <!-- ZEROHUNGER 360 Title -->
        <div class="space-y-1 title-text">
          <div class="flex items-center justify-center gap-2">
            <h1 class="font-black text-4xl sm:text-6xl tracking-tight text-[var(--text-main)]">
              ZEROHUNGER
            </h1>
            <span class="font-black text-4xl sm:text-6xl text-[var(--success)]">
              360
            </span>
          </div>
          <p class="text-xs sm:text-sm font-bold text-[var(--success)] tracking-wide">
            "Turning Surplus Food Into Hope"
          </p>
        </div>

        <p class="text-xs text-[var(--text-muted)] max-w-md font-semibold leading-relaxed">
          Connecting surplus food with people who need it. Building a hunger-free world...
        </p>

        <!-- Dynamic 5-Step Progress Card -->
        <div class="progress-card w-full max-w-md p-6 rounded-3xl space-y-4 bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-color)] shadow-xl">
          <!-- Progress Bar -->
          <div class="h-3 bg-[var(--bg-surface)] rounded-full overflow-hidden p-0.5 border border-[var(--border-color)]">
            <div
              class="h-full bg-gradient-to-r from-[var(--success)] via-[var(--success)] to-[var(--blue)] rounded-full transition-all duration-300 ease-out shadow-md"
              [style.width.%]="progress()"
            ></div>
          </div>

          <!-- Dynamic Status Step Message -->
          <div class="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[var(--success)] animate-ping"></span>
              {{ currentStepMessage }}
            </span>
            <span class="font-mono text-[var(--success)] text-sm font-black">{{ progress() }}%</span>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 text-center text-xs font-semibold text-[var(--text-muted)] pb-2">
        <span>ZeroHunger AI Logistics Engine</span>
        <span class="mx-2 text-[var(--success)]">•</span>
        <span>Enterprise Platform</span>
      </div>
    </div>
  `,
})
export class LoginTransitionComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly progress = signal(0);
  readonly stepIndex = signal(0);

  readonly steps = [
    '🌱 Preparing food rescue network...',
    '🍱 Finding available surplus meals...',
    '🚚 Optimizing rescue routes...',
    '🤝 Connecting communities...',
    '🌍 Welcome to ZeroHunger 360',
  ];

  get currentStepMessage(): string {
    return this.steps[this.stepIndex()];
  }

  ngOnInit(): void {
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current > 100) current = 100;
      this.progress.set(current);

      const idx = Math.min(
        Math.floor((current / 100) * this.steps.length),
        this.steps.length - 1
      );
      this.stepIndex.set(idx);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      }
    }, 70);
  }
}
