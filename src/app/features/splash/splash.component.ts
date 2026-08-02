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
          query('.mesh-orb', [
            style({ opacity: 0, transform: 'scale(0.6)' }),
            animate('1200ms ease-out', style({ opacity: 0.25, transform: 'scale(1)' })),
          ], { optional: true }),
          query('.logo-glow', [
            style({ opacity: 0, transform: 'scale(0.7)' }),
            animate('900ms 200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
          ], { optional: true }),
          query('.letter-char', [
            style({ opacity: 0, transform: 'translateY(20px) scale(0.8)' }),
            stagger(40, [
              animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
            ]),
          ], { optional: true }),
          query('.loading-card', [
            style({ opacity: 0, transform: 'translateY(24px) scale(0.95)' }),
            animate('700ms 600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
  template: `
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFBF5] overflow-hidden p-6" @splashMaster>
      <!-- Background Glowing Orbs -->
      <div class="mesh-orb absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#7743DB]/15 blur-[120px] pointer-events-none"></div>
      <div class="mesh-orb absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#C3ACD0]/25 blur-[120px] pointer-events-none"></div>

      <div class="relative z-10 max-w-md w-full flex flex-col items-center text-center">
        <!-- Logo Glow Capsule -->
        <div class="logo-glow w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#7743DB] via-[#9055EE] to-[#C3ACD0] p-1 shadow-2xl shadow-[#7743DB]/30 mb-8 flex items-center justify-center">
          <div class="w-full h-full bg-[#1A1A1A] rounded-[22px] flex items-center justify-center">
            <svg class="w-12 h-12 text-[#C3ACD0]" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
        </div>

        <!-- Animated Title -->
        <div class="flex items-center justify-center gap-0.5 mb-2">
          @for (char of brandLetters; track $index) {
            <span class="letter-char font-extrabold text-4xl sm:text-5xl tracking-tight text-[#1A1A1A]">{{ char }}</span>
          }
        </div>

        <p class="text-sm font-semibold text-[#7743DB] tracking-wide mb-10">
          AI-Powered Surplus Food Redistribution Network
        </p>

        <!-- Loading Progress Card -->
        <div class="loading-card glass-panel w-full p-6 rounded-3xl space-y-4 shadow-2xl border border-[#E8DDD3]">
          <div class="h-2.5 bg-[#F7EFE5] rounded-full overflow-hidden p-0.5 border border-[#E8DDD3]">
            <div
              class="h-full bg-gradient-to-r from-[#7743DB] to-[#C3ACD0] rounded-full transition-all duration-300 ease-out shadow-sm"
              [style.width.%]="progress()"
            ></div>
          </div>

          <div class="flex items-center justify-between text-xs font-semibold text-[#5B5B6A]">
            <span>{{ currentMessage }}</span>
            <span class="font-mono text-[#7743DB] font-bold text-sm">{{ progress() }}%</span>
          </div>
        </div>
      </div>

      <!-- Footer Badge -->
      <div class="absolute bottom-8 text-center text-xs font-semibold text-[#5B5B6A]">
        <span>ZeroHunger Enterprise Platform</span>
        <span class="mx-2 text-[#7743DB]">•</span>
        <span>Version 2.0</span>
      </div>
    </div>
  `,
})
export class SplashComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly brandLetters = ['Z', 'e', 'r', 'o', 'H', 'u', 'n', 'g', 'e', 'r'];
  readonly progress = signal(0);
  readonly currentMessageIndex = signal(0);

  readonly statusMessages = [
    'Connecting to ZeroHunger Network...',
    'Loading Enterprise Resources...',
    'Preparing Dashboard & Maps...',
    'Fetching Live Surplus Food Data...',
    'Initializing Logistics Engine...',
    'Ready!',
  ];

  get currentMessage(): string {
    return this.statusMessages[this.currentMessageIndex()];
  }

  ngOnInit(): void {
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current > 100) current = 100;
      this.progress.set(current);

      const msgIdx = Math.min(
        Math.floor((current / 100) * this.statusMessages.length),
        this.statusMessages.length - 1
      );
      this.currentMessageIndex.set(msgIdx);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/welcome']);
          }
        }, 400);
      }
    }, 80);
  }
}
