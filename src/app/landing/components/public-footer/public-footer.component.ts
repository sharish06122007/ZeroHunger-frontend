import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-brand-primary text-white pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
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
      
      <div class="max-w-7xl mx-auto px-4 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between relative z-10">
        <p class="text-white/60 text-sm">© 2026 ZeroHunger. All rights reserved.</p>
        <div class="text-white/60 text-sm mt-4 md:mt-0">Connecting communities through food.</div>
      </div>

      <!-- Giant 3D Edge-to-Edge Typography -->
      <div class="w-full overflow-hidden flex justify-center items-end mt-12 mb-[-1rem] pointer-events-none select-none relative z-0">
        <h1 class="text-[14.5vw] font-black leading-none tracking-tighter uppercase text-[#3E7B27] opacity-80 mix-blend-lighten"
            style="text-shadow: 0 1px 0 #2c591c, 0 2px 0 #28511a, 0 3px 0 #244917, 0 4px 0 #204115, 0 5px 0 #1b3812, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);">
          ZEROHUNGER
        </h1>
      </div>
    </footer>
  `
})
export class PublicFooterComponent {}
