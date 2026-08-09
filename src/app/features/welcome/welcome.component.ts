import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FallingFoodBackgroundComponent } from '../../shared/components/falling-food/falling-food-background/falling-food-background.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, FallingFoodBackgroundComponent],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <app-navbar />

    <main class="min-h-screen bg-[var(--bg-main)] relative overflow-hidden">
      <!-- Light Falling Food Canvas Background -->
      <app-falling-food-background></app-falling-food-background>
      <!-- Ambient Orbs -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none"></div>

      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10" @fadeUp>
        <div class="text-center max-w-3xl mx-auto space-y-6">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--primary)] shadow-sm">
            <span class="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
            ENTERPRISE FOOD REDISTRIBUTION
          </div>

          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight">
            Turn Surplus Food Into <span class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Global Impact</span>
          </h1>

          <p class="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            ZeroHunger bridges the gap between commercial kitchens, food banks, logistics couriers, and NGOs. Real-time surplus dispatch, automated route tracking, and verified tax reporting.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a routerLink="/auth/register" class="btn-primary">
              Get Started Free →
            </a>
            <a routerLink="/auth/login" class="btn-secondary">
              Sign In to Portal
            </a>
          </div>

          <!-- Quick Metrics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
            @for (stat of stats; track stat.label) {
              <div class="zh-card text-center p-6">
                <p class="text-2xl sm:text-3xl font-extrabold text-[var(--primary)]">{{ stat.value }}</p>
                <span class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mt-1">{{ stat.label }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Role Cards Selection Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">Built for Every Stakeholder</h2>
          <p class="text-sm text-[var(--text-muted)] mt-2">Select your organization type to explore specialized features</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (role of roles; track role.title) {
            <div class="zh-card flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-2xl flex items-center justify-center">
                  {{ role.icon }}
                </div>
                <h3 class="font-extrabold text-lg text-[var(--text-main)]">{{ role.title }}</h3>
                <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{ role.description }}</p>
              </div>
              <a routerLink="/auth/register" [queryParams]="{ role: role.roleKey }" class="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                Join as {{ role.title }} →
              </a>
            </div>
          }
        </div>
      </section>

      <!-- Features Showcase Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div class="zh-card p-8 sm:p-12 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-main)]">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <span class="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold rounded-full">AI Matching Engine</span>
              <h2 class="text-3xl font-extrabold text-[var(--text-main)] leading-tight">
                Automated Logistics & Direct Food Rescue Routing
              </h2>
              <p class="text-sm text-[var(--text-muted)] leading-relaxed">
                Our algorithm matches perishable food listings with nearest verified NGOs and available courier volunteers, cutting pickup latency by 65%.
              </p>
              <div class="space-y-3">
                @for (feat of features; track feat) {
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded-full bg-[var(--success)]/15 text-[var(--success)] flex items-center justify-center text-xs font-bold">✓</div>
                    <span class="text-xs font-semibold text-[var(--text-main)]">{{ feat }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="p-6 rounded-3xl bg-[var(--dark)] text-white space-y-6 shadow-2xl border border-white/10">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[var(--secondary)]">Live Activity Stream</span>
                <span class="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
              </div>
              <div class="space-y-3">
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex justify-between items-center">
                  <span>Grand Hyatt • 50 kg Gourmet Meals</span>
                  <span class="text-[var(--success)] font-semibold">Rescued</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex justify-between items-center">
                  <span>St. Jude Shelter • Request #941</span>
                  <span class="text-[var(--warning)] font-semibold">In Transit</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex justify-between items-center">
                  <span>Volunteer Courier Alex</span>
                  <span class="text-[var(--secondary)] font-semibold">Assigned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <app-footer />
  `,
})
export class WelcomeComponent {
  readonly stats = [
    { value: '182,000+', label: 'Meals Rescued' },
    { value: '470+', label: 'Verified Partners' },
    { value: '19 min', label: 'Avg Pickup Time' },
    { value: '99.8%', label: 'Delivery Success' },
  ];

  readonly roles = [
    { icon: '🏪', title: 'Commercial Donor', roleKey: 'restaurant', description: 'Restaurants, hotels, caterers, and bakeries posting surplus food listings.' },
    { icon: '🏢', title: 'NGO & Shelter', roleKey: 'ngo', description: 'Non-profit organizations requesting food for local beneficiaries.' },
    { icon: '🚚', title: 'Volunteer Courier', roleKey: 'volunteer', description: 'Logistics volunteers picking up and delivering meals safely.' },
    { icon: '🎁', title: 'Monetary Supporter', roleKey: 'donor', description: 'Donors funding cold-chain storage and logistics infrastructure.' },
  ];

  readonly features = [
    'Real-time GPS route optimization & ETA tracking',
    'Automated expiry time countdowns & food safety tags',
    'Role-based dashboards & compliance audit logs',
    'Instant push notifications & SMS dispatch',
  ];
}
