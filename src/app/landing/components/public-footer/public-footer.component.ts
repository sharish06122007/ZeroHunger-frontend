import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-brand-primary text-white pt-16 pb-8 relative overflow-hidden">
      
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-primary font-bold text-lg">Z</div>
            <div class="text-white font-bold text-xl tracking-tight">ZeroHunger</div>
          </div>
          <p class="text-brand-warm/80 text-sm mb-6 leading-relaxed">Connecting Food. Supporting People. Building Hope. A premium social-impact ecosystem.</p>
        </div>
        
        <div>
          <h3 class="text-brand-warm font-semibold mb-4 text-lg">Platform</h3>
          <div class="flex flex-col gap-3">
            <a routerLink="/dashboard/food" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Find Food</a>
            <a routerLink="/dashboard/food/create" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Provide Food</a>
            <a routerLink="/dashboard/requests" class="text-white/80 hover:text-brand-accent transition-colors text-sm">NGO Requests</a>
            <a routerLink="/dashboard/volunteer" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Volunteer</a>
          </div>
        </div>

        <div>
          <h3 class="text-brand-warm font-semibold mb-4 text-lg">Organization</h3>
          <div class="flex flex-col gap-3">
            <a routerLink="/about" class="text-white/80 hover:text-brand-accent transition-colors text-sm">About Us</a>
            <a routerLink="/impact" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Our Impact</a>
            <a routerLink="/impact" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Community Stories</a>
            <a routerLink="/contact" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Contact</a>
          </div>
        </div>

        <div>
          <h3 class="text-brand-warm font-semibold mb-4 text-lg">Legal</h3>
          <div class="flex flex-col gap-3">
            <a routerLink="/privacy" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Privacy Policy</a>
            <a routerLink="/terms" class="text-white/80 hover:text-brand-accent transition-colors text-sm">Terms of Use</a>
            <a routerLink="/faq" class="text-white/80 hover:text-brand-accent transition-colors text-sm">FAQ</a>
          </div>
        </div>
      </div>

      <!-- Glowing Outline Typography -->
      <div class="max-w-7xl mx-auto px-4 pointer-events-none select-none mb-8 relative z-0 flex justify-center items-center overflow-visible w-full">
        <!-- Radial glow behind text -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150px] bg-white/10 blur-[80px] rounded-[100%]"></div>
        <div class="text-[13vw] xl:text-[150px] font-black uppercase tracking-tight text-outline-glow leading-none text-center w-full relative z-10">
          ZEROHUNGER
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between relative z-10">
        <p class="text-white/60 text-sm">© 2026 ZeroHunger. All rights reserved.</p>
        <div class="text-white/60 text-sm mt-4 md:mt-0">Connecting communities through food.</div>
      </div>
    </footer>
  `,
  styles: [`
    .text-outline-glow {
      color: transparent;
      -webkit-text-stroke: 2px rgba(255, 255, 255, 0.85);
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.2);
    }
  `]
})
export class PublicFooterComponent {}
