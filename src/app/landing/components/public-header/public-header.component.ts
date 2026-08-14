import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpecularButtonComponent } from '../../../shared/components/specular-button/specular-button.component';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterModule, SpecularButtonComponent],
  template: `
    <header class="fixed top-0 left-0 right-0 h-[80px] bg-brand-warm/95 backdrop-blur-md z-50 border-b border-brand-border">
      <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        <a routerLink="/" class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white">
            <img src="assets/images/logo.jpg" alt="ZeroHunger Logo" class="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div class="hidden sm:block">
            <div class="text-[var(--text-main)] font-black text-2xl tracking-tight leading-none">ZeroHunger</div>
            <div class="text-[9px] text-[var(--primary)] font-bold tracking-[0.2em] mt-1 uppercase">FOOD • COMMUNITY • CARE</div>
          </div>
        </a>

        <nav class="hidden md:flex items-center gap-8">
          <a routerLink="/home" class="text-[var(--text-main)] font-bold text-sm hover:text-[var(--primary)] transition-colors">Home</a>
          <a routerLink="/dashboard/food" class="text-[var(--text-main)] font-bold text-sm hover:text-[var(--primary)] transition-colors">Find Food</a>
          <a routerLink="/dashboard/food/create" class="text-[var(--text-main)] font-bold text-sm hover:text-[var(--primary)] transition-colors">Provide Food</a>
          <a routerLink="/dashboard/ngo" class="text-[var(--text-main)] font-bold text-sm hover:text-[var(--primary)] transition-colors">NGO Partners</a>
          <a routerLink="/about" class="text-[var(--text-main)] font-bold text-sm hover:text-[var(--primary)] transition-colors">About Us</a>
          <a routerLink="/impact" class="text-[var(--text-main)] font-bold text-sm hover:text-[var(--primary)] transition-colors">Impact</a>
          <a routerLink="/contact" class="text-[var(--text-main)] font-bold text-sm hover:text-[var(--primary)] transition-colors">Contact</a>
        </nav>

        <div class="flex items-center gap-4">
          <a routerLink="/auth/login" class="text-[var(--primary)] font-bold text-sm hover:text-[var(--primary-deep)] transition-colors hidden sm:block">Login</a>
          <a routerLink="/auth/register" style="text-decoration: none; display: inline-block;">
            <app-specular-button
              size="sm"
              [radius]="100"
              tint="#3E7B27"
              [tintOpacity]="1"
              baseColor="#123524"
              lineColor="#85A947"
              textColor="#ffffff"
              [autoAnimate]="true"
              [speed]="1"
            >
              Get Started
            </app-specular-button>
          </a>
        </div>

      </div>
    </header>
  `
})
export class PublicHeaderComponent {}
