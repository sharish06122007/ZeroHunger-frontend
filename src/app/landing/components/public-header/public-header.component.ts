import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="fixed top-0 left-0 right-0 h-[80px] bg-brand-warm/95 backdrop-blur-md z-50 border-b border-brand-border">
      <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        <a routerLink="/" class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xl">Z</div>
          <div>
            <div class="text-brand-primary font-bold text-xl tracking-tight leading-none">ZeroHunger</div>
            <div class="text-[10px] text-brand-secondary font-medium tracking-widest mt-1">FOOD • COMMUNITY • CARE</div>
          </div>
        </a>

        <nav class="hidden md:flex items-center gap-8">
          <a routerLink="/home" class="text-brand-textMain font-medium hover:text-brand-primary transition-colors">Home</a>
          <a routerLink="/find-food" class="text-brand-textMain font-medium hover:text-brand-primary transition-colors">Find Food</a>
          <a routerLink="/provide-food" class="text-brand-textMain font-medium hover:text-brand-primary transition-colors">Provide Food</a>
          <a routerLink="/about" class="text-brand-textMain font-medium hover:text-brand-primary transition-colors">About Us</a>
        </nav>

        <div class="flex items-center gap-4">
          <a routerLink="/auth/login" class="text-brand-primary font-medium hover:text-brand-secondary transition-colors hidden sm:block">Login</a>
          <a routerLink="/auth/register" class="btn-primary">Get Started</a>
        </div>

      </div>
    </header>
  `
})
export class PublicHeaderComponent {}
