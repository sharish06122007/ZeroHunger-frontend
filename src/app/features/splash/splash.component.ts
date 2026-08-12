import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { AuthService } from '../../core/authentication/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(24px)' }),
          stagger(150, [
            animate('700ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1200ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="fixed inset-0 z-50 flex flex-col bg-[#EFE3C2] text-[#123524] overflow-hidden select-none">
      
      <!-- Main Content Split -->
      <div class="flex-1 flex flex-col lg:flex-row relative">
        
        <!-- RIGHT SIDE: Edge-to-Edge Image (Behind on Mobile, Split on Desktop) -->
        <div class="absolute inset-0 lg:relative lg:flex-1 lg:inset-auto z-0" @fadeIn>
          <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#EFE3C2] via-[#EFE3C2]/90 lg:via-[#EFE3C2]/40 to-transparent z-10"></div>
          <img src="assets/images/hero_food.jpg" alt="Community sharing food" class="w-full h-full object-cover object-center" />
          
          <!-- Floating Info Card -->
          <div class="hidden lg:flex absolute bottom-12 right-12 z-20 backdrop-blur-md bg-white/90 p-4 rounded-2xl items-center gap-4 text-[#123524] shadow-2xl animate-fade-in-up" style="animation-delay: 800ms; max-width: 320px;">
            <div class="w-12 h-12 rounded-full bg-[#85A947]/20 flex items-center justify-center shrink-0 text-[#3E7B27] text-xl">
              🌿
            </div>
            <div>
              <p class="font-extrabold text-sm leading-tight">Fresh Meals. Real Impact.</p>
              <p class="text-xs font-medium text-[#123524]/70 mt-1">Powered by local food makers and community volunteers.</p>
            </div>
          </div>
        </div>

        <!-- LEFT SIDE: Text and Actions -->
        <div class="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-16 lg:pt-0 max-w-3xl" @fadeUp>
          
          <!-- Logo & Badge -->
          <div class="stagger-item flex items-center gap-4 mb-10">
            <div class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-xl shadow-[#123524]/10">
              <img src="assets/images/logo.jpg" alt="ZeroHunger Logo" class="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#123524]/10 text-xs font-bold text-[#3E7B27] shadow-sm backdrop-blur-sm">
              <span class="w-2 h-2 rounded-full bg-[#85A947] animate-pulse"></span>
              FOOD • COMMUNITY • CARE
            </div>
          </div>

          <!-- Headline -->
          <h1 class="stagger-item text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            <span class="block text-[#123524]">Connecting Food.</span>
            <span class="block text-[#123524]">Supporting People.</span>
            <span class="block text-[#3E7B27]">Building Hope.</span>
          </h1>

          <!-- Description -->
          <p class="stagger-item text-lg sm:text-xl text-[#123524]/80 max-w-xl leading-relaxed font-medium mb-10">
            ZeroHunger helps organizations connect food donations, food requests, NGOs and local operations so good food reaches the people and communities who need it most.
          </p>

          <!-- Action Buttons -->
          <div class="stagger-item flex flex-wrap items-center gap-4">
            <button (click)="proceedToApp()" class="bg-[#3E7B27] hover:bg-[#3E7B27]/90 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-[#3E7B27]/30 transition-transform hover:-translate-y-1">
              GET STARTED
            </button>
            <button (click)="proceedToHome()" class="bg-white/80 text-[#123524] border-2 border-[#123524]/10 hover:border-[#123524]/30 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-transform hover:-translate-y-1 backdrop-blur-sm">
              EXPLORE IMPACT
            </button>
          </div>

        </div>
      </div>

      <!-- BOTTOM: Trust Strip -->
      <div class="relative z-20 bg-white/40 backdrop-blur-lg border-t border-[#123524]/5 py-4">
        <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-around items-center gap-6 text-[#123524]/70 font-bold text-[10px] sm:text-xs tracking-widest uppercase">
          <div class="flex items-center gap-2"><span class="text-[#85A947] text-lg">🛡️</span> Verified Operations</div>
          <div class="flex items-center gap-2"><span class="text-[#85A947] text-lg">🤝</span> Local Community Network</div>
          <div class="flex items-center gap-2"><span class="text-[#85A947] text-lg">📍</span> Real-Time Coordination</div>
          <div class="flex items-center gap-2"><span class="text-[#85A947] text-lg">👁️</span> Transparent Impact</div>
        </div>
      </div>

    </div>
  `,
})
export class SplashComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  proceedToApp(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/register']);
    }
  }

  proceedToHome(): void {
    this.router.navigate(['/home']);
  }
}
