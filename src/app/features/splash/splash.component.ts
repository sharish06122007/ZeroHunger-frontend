import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, query, stagger, group } from '@angular/animations';
import { AuthService } from '../../core/authentication/auth.service';
import { FloatingFoodCanvasComponent } from '../../shared/components/floating-food/floating-food-canvas.component';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, FloatingFoodCanvasComponent],
  animations: [
    trigger('splashMaster', [
      transition(':enter', [
        group([
          query('.mesh-orb', [
            style({ opacity: 0, transform: 'scale(0.6)' }),
            animate('1200ms ease-out', style({ opacity: 0.35, transform: 'scale(1)' })),
          ], { optional: true }),
          query('.logo-glow', [
            style({ opacity: 0, transform: 'scale(0.6)' }),
            animate('900ms 200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
          ], { optional: true }),
          query('.title-badge', [
            style({ opacity: 0, transform: 'translateY(-12px)' }),
            animate('600ms 300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
          ], { optional: true }),
          query('.letter-char', [
            style({ opacity: 0, transform: 'translateY(24px) scale(0.8)' }),
            stagger(50, [
              animate('450ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
            ]),
          ], { optional: true }),
          query('.loading-card', [
            style({ opacity: 0, transform: 'translateY(28px) scale(0.95)' }),
            animate('700ms 600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
  template: `
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#0A0A12] via-[#140A28] to-[#0A0A12] text-white overflow-hidden p-6 sm:p-10 select-none" @splashMaster>
      <!-- Background 3D/2D Floating Food Canvas -->
      <app-floating-food-canvas></app-floating-food-canvas>

      <!-- Ambient Glowing Orbs -->
      <div class="mesh-orb absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#7743DB]/20 blur-[130px] pointer-events-none"></div>
      <div class="mesh-orb absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[130px] pointer-events-none"></div>

      <!-- Top Badge -->
      <div class="relative z-10 pt-4 title-badge">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-extrabold text-[#C3ACD0] border border-white/15 backdrop-blur-xl shadow-xl">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          FUTURISTIC AI FOOD RESCUE ECOSYSTEM
        </div>
      </div>

      <!-- Main Center Content -->
      <div class="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-6 my-auto">
        <!-- Logo Glow Capsule -->
        <div class="logo-glow w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#7743DB] via-[#9055EE] to-[#22C55E] p-1 shadow-2xl shadow-[#7743DB]/40 flex items-center justify-center">
          <div class="w-full h-full bg-[#0E0C18] rounded-[22px] flex items-center justify-center">
            <span class="text-5xl animate-bounce">🍱</span>
          </div>
        </div>

        <!-- Animated Title ZEROHUNGER 360 -->
        <div class="space-y-1">
          <div class="flex items-center justify-center gap-0.5">
            @for (char of brandLetters; track $index) {
              <span class="letter-char font-black text-4xl sm:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#C3ACD0] drop-shadow-lg">
                {{ char }}
              </span>
            }
            <span class="letter-char font-black text-4xl sm:text-6xl text-[#22C55E] ml-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              360
            </span>
          </div>

          <h2 class="text-sm sm:text-base font-bold text-[#C3ACD0] tracking-wide">
            "Turning Surplus Food Into Hope"
          </h2>
        </div>

        <p class="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
          Saving food. Feeding people. Building a hunger-free world with automated dispatch & real-time logistics.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2 w-full">
          <button (click)="proceedToApp()" class="btn-primary py-3.5 px-8 text-xs font-black rounded-2xl shadow-xl shadow-[#7743DB]/40 border border-white/20">
            Explore Platform 🚀
          </button>
          <button (click)="proceedToNetwork()" class="btn-secondary py-3.5 px-8 text-xs font-black rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-xl">
            Join Rescue Network 🤝
          </button>
        </div>

        <!-- Loading Progress Card -->
        <div class="loading-card w-full p-5 rounded-3xl space-y-3 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div class="h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              class="h-full bg-gradient-to-r from-[#7743DB] via-[#9055EE] to-[#22C55E] rounded-full transition-all duration-300 ease-out shadow-lg"
              [style.width.%]="progress()"
            ></div>
          </div>

          <div class="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
              {{ currentMessage }}
            </span>
            <span class="font-mono text-[#22C55E] font-bold text-sm">{{ progress() }}%</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="relative z-10 text-center text-xs font-semibold text-slate-400 pb-2">
        <span>ZeroHunger 360 AI Operating System</span>
        <span class="mx-2 text-[#7743DB]">•</span>
        <span>Version 2.0 Enterprise</span>
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
    'Finding surplus food...',
    'Matching communities...',
    'Optimizing rescue routes...',
    'Building a hunger-free future...',
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
