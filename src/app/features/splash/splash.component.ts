import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, query, stagger, group } from '@angular/animations';
import { AuthService } from '../../core/authentication/auth.service';
import { FallingFoodBackgroundComponent } from '../../shared/components/falling-food/falling-food-background.component';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, FallingFoodBackgroundComponent],
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
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#FAFAF9] via-[#F0FDF4] to-[#FFFBF5] text-[#1A1A1A] overflow-hidden p-6 sm:p-10 select-none" @splashMaster>
      <!-- 60FPS Continuous 3D Food Rescue Ecosystem Background Canvas -->
      <app-falling-food-background></app-falling-food-background>

      <!-- Top Header Badge -->
      <div class="relative z-10 pt-4 title-badge">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-xs font-bold text-[#16A34A] border border-[#16A34A]/25 shadow-md backdrop-blur-md">
          <span class="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          SUSTAINABLE FOOD RESCUE NETWORK
        </div>
      </div>

      <!-- Main Center Content Priority Block -->
      <div class="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-6 my-auto">
        <!-- ZeroHunger Centered Main Logo with Glow Aura -->
        <div class="logo-glow-aura relative flex justify-center items-center">
          <!-- Subtle natural green glow behind the logo -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#16A34A] via-[#10B981] to-[#059669] opacity-30 blur-2xl scale-125 animate-pulse"></div>
          
          <!-- Exact ZeroHunger Logo Image -->
          <div class="relative w-36 h-36 flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.15)] ring-1 ring-white/50 bg-white backdrop-blur-sm z-10">
            <img src="assets/images/logo.jpg" alt="ZeroHunger Logo" class="w-full h-full object-cover mix-blend-multiply" />
          </div>
        </div>

        <!-- Main Title ZEROHUNGER 360 -->
        <div class="space-y-1">
          <div class="flex items-center justify-center gap-0.5">
            @for (char of brandLetters; track $index) {
              <span class="letter-char font-black text-4xl sm:text-6xl tracking-tight text-[#1A1A1A]">
                {{ char }}
              </span>
            }
            <span class="letter-char font-black text-4xl sm:text-6xl text-[#16A34A] ml-2">
              360
            </span>
          </div>

          <h2 class="text-sm sm:text-base font-bold text-[#16A34A] tracking-wide">
            "Surplus Food Transforming Into Hope"
          </h2>
        </div>

        <!-- Hero Description -->
        <p class="hero-description text-xs sm:text-sm text-[#5B5B6A] max-w-lg leading-relaxed font-semibold">
          Connecting donors, NGOs, and volunteers in a continuous food rescue journey to eliminate food waste.
        </p>

        <!-- Action Buttons -->
        <div class="cta-buttons flex flex-wrap items-center justify-center gap-4 pt-2 w-full">
          <button (click)="proceedToApp()" class="btn-primary py-3.5 px-8 text-xs font-bold rounded-2xl shadow-xl shadow-[#16A34A]/20">
            Explore Platform 🚀
          </button>
          <button (click)="proceedToNetwork()" class="btn-secondary py-3.5 px-8 text-xs font-bold rounded-2xl bg-white/90 text-[#1A1A1A] border border-[#E8DDD3]">
            Join Rescue Network 🤝
          </button>
        </div>

        <!-- Dynamic Loading Progress Card -->
        <div class="loading-card w-full p-5 rounded-3xl space-y-3 bg-white/95 backdrop-blur-xl border border-[#E8DDD3] shadow-xl">
          <div class="h-2.5 bg-[#F7EFE5] rounded-full overflow-hidden p-0.5 border border-[#E8DDD3]">
            <div
              class="h-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#0284C7] rounded-full transition-all duration-300 ease-out"
              [style.width.%]="progress()"
            ></div>
          </div>

          <div class="flex items-center justify-between text-xs font-semibold text-[#5B5B6A]">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-ping"></span>
              {{ currentMessage }}
            </span>
            <span class="font-mono text-[#16A34A] font-bold text-sm">{{ progress() }}%</span>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 text-center text-xs font-semibold text-[#5B5B6A] pb-2">
        <span>ZeroHunger 360 Ecosystem</span>
        <span class="mx-2 text-[#16A34A]">•</span>
        <span>Sustainable Food Rescue</span>
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
    'Emerging food rescue network...',
    'Matching surplus meals...',
    'Optimizing delivery routes...',
    'Transforming food into hope...',
    'Connecting Food With People...',
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
      this.router.navigate(['/welcome']);
    }
  }

  proceedToNetwork(): void {
    this.router.navigate(['/auth/register']);
  }
}
