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
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(120, [
            animate('800ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1200ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('1000ms 400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="fixed inset-0 z-50 flex bg-[#EFE3C2] text-[#123524] overflow-hidden select-none font-sans">
      
      <!-- LEFT COLUMN: Content (Strict 50%) -->
      <div class="relative z-10 w-full lg:w-1/2 flex flex-col justify-between h-full px-8 sm:px-16 lg:px-24 pt-16 pb-12 bg-gradient-to-br from-[#EFE3C2] to-[#EFE3C2]/95" @fadeUp>
        
        <!-- Ambient subtle glow -->
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3E7B27]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <!-- Top Section: Content -->
        <div class="flex-1 flex flex-col justify-center max-w-2xl">
          
          <!-- Premium Logo & Badge -->
          <div class="stagger-item flex items-center gap-6 mb-12">
            <div class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-2xl shadow-[#123524]/20 border border-white/50">
              <img src="assets/images/logo.jpg" alt="ZeroHunger Logo" class="w-full h-full object-cover mix-blend-multiply" />
            </div>
            
            <!-- Glassmorphism Badge -->
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/40 border border-white/60 text-[11px] font-extrabold text-[#3E7B27] shadow-sm backdrop-blur-md tracking-widest uppercase">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#85A947] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3E7B27]"></span>
              </span>
              Food • Community • Care
            </div>
          </div>

          <!-- Ultra-Premium Headline -->
          <h1 class="stagger-item text-6xl lg:text-[5rem] font-black tracking-tight leading-[1.05] mb-8 text-[#123524]">
            Connecting Food.<br/>
            Supporting People.<br/>
            <span class="text-[#3E7B27] relative">
              Building Hope.
              <!-- Subtle underline graphic under Hope -->
              <svg class="absolute w-full h-4 -bottom-1 left-0 text-[#85A947]/30" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 -2 150 -2 198 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </span>
          </h1>

          <!-- Sophisticated Description -->
          <p class="stagger-item text-xl text-[#123524]/70 max-w-lg leading-relaxed font-medium mb-12">
            ZeroHunger helps organizations connect food donations, food requests, NGOs and local operations so good food reaches the people and communities who need it most.
          </p>

          <!-- Precision Action Buttons -->
          <div class="stagger-item flex flex-wrap items-center gap-5">
            <button (click)="proceedToApp()" class="group relative bg-[#123524] text-[#EFE3C2] px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-[#123524]/30 overflow-hidden transition-transform hover:-translate-y-1">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span class="flex items-center gap-3">GET STARTED <span class="text-xl leading-none transition-transform group-hover:translate-x-1">→</span></span>
            </button>
            <button (click)="proceedToHome()" class="group px-10 py-5 rounded-2xl text-lg font-bold text-[#123524] border-2 border-[#123524]/10 hover:border-[#3E7B27] hover:text-[#3E7B27] transition-all bg-white/20 backdrop-blur-sm">
              EXPLORE IMPACT
            </button>
          </div>
        </div>

        <!-- Bottom Section: Trust Strip built directly into the Left Footer -->
        <div class="stagger-item pt-8 mt-12 border-t border-[#123524]/10">
          <div class="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-6 h-6 rounded-full bg-[#3E7B27]/10 flex items-center justify-center text-[#3E7B27] text-xs">✓</div>
              <span class="text-[10px] font-extrabold text-[#123524]/60 tracking-widest uppercase">Verified Operations</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-6 h-6 rounded-full bg-[#3E7B27]/10 flex items-center justify-center text-[#3E7B27] text-xs">🤝</div>
              <span class="text-[10px] font-extrabold text-[#123524]/60 tracking-widest uppercase">Local Community Network</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-6 h-6 rounded-full bg-[#3E7B27]/10 flex items-center justify-center text-[#3E7B27] text-xs">📍</div>
              <span class="text-[10px] font-extrabold text-[#123524]/60 tracking-widest uppercase">Real-Time Coordination</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Edge-to-Edge Imagery (Strict 50%) -->
      <div class="hidden lg:block relative w-1/2 h-full z-0 overflow-hidden bg-[#123524]" @fadeIn>
        <!-- The ultra-realistic photography -->
        <img src="assets/images/hero_food.jpg" alt="Community sharing food" class="absolute inset-0 w-full h-full object-cover object-center scale-105" />
        
        <!-- Elegant subtle gradient to blend the edge -->
        <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#EFE3C2] to-transparent z-10"></div>
        
        <!-- Floating Glassmorphism Info Card -->
        <div class="absolute bottom-16 left-12 z-20" @slideInRight>
          <div class="backdrop-blur-xl bg-white/80 p-5 rounded-3xl shadow-2xl border border-white flex items-center gap-5 max-w-sm transform hover:-translate-y-2 transition-transform duration-500">
            <div class="w-14 h-14 rounded-2xl bg-[#EFE3C2] flex items-center justify-center shrink-0 shadow-inner">
              <span class="text-2xl">🍲</span>
            </div>
            <div>
              <p class="font-black text-[#123524] text-base leading-tight mb-1">Fresh Meals. Real Impact.</p>
              <p class="text-xs font-semibold text-[#123524]/60">Powered by local food makers and community volunteers.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `]
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
