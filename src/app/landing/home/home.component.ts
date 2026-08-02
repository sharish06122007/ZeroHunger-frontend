// landing/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page">
      <!-- Navbar -->
      <nav class="landing-nav">
        <div class="nav-container">
          <div class="brand">
            <span class="logo">🍱</span>
            <span class="name">ZeroHunger</span>
          </div>
          <div class="nav-actions">
            <a routerLink="/auth/login" class="btn btn-ghost">Sign In</a>
            <a routerLink="/auth/register" class="btn btn-primary">Get Started Free</a>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section class="hero-section">
        <div class="hero-container">
          <span class="badge badge-primary mb-2">ZERO FOOD WASTE · ZERO HUNGER</span>
          <h1>Rescue Surplus Food. Feed Communities.</h1>
          <p>The enterprise-grade full-stack platform connecting hotels, restaurants, NGOs, and volunteers in real time.</p>
          <div class="hero-cta">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">Join ZeroHunger 🚀</a>
            <a routerLink="/welcome" class="btn btn-outline btn-lg">Learn More →</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .landing-page { min-height: 100vh; background: #0F172A; color: #fff; }
    .landing-nav { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
    .brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; }
    .nav-actions { display: flex; gap: 12px; }

    .hero-section { padding: 120px 24px; text-align: center; max-width: 800px; margin: 0 auto; }
    .hero-section h1 { font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 20px; }
    .hero-section p { font-size: 20px; color: #94A3B8; margin-bottom: 36px; }
    .hero-cta { display: flex; gap: 16px; justify-content: center; }
  `],
})
export class HomeComponent {}
