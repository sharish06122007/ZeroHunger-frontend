import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-brand-warm">
      <app-public-header></app-public-header>
      <main class="flex-grow pt-[80px]">
        <router-outlet></router-outlet>
      </main>
      <app-public-footer></app-public-footer>
    </div>
  `
})
export class LandingLayoutComponent {}
