import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
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

    <main class="min-h-screen bg-[#FFFBF5] relative overflow-hidden">
      <!-- Ambient Orbs -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7743DB]/10 blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#C3ACD0]/20 blur-3xl pointer-events-none"></div>

      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10" @fadeUp>
        <div class="text-center max-w-3xl mx-auto space-y-6">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7EFE5] border border-[#E8DDD3] text-xs font-bold text-[#7743DB]">
            <span class="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            Enterprise Food Redistribution Engine
          </div>

          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight">
            Turn Surplus Food Into <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#7743DB] to-[#C3ACD0]">Global Impact</span>
          </h1>

          <p class="text-base sm:text-lg text-[#5B5B6A] leading-relaxed">
            ZeroHunger bridges the gap between commercial kitchens, food banks, logistics couriers, and NGOs. Real-time surplus dispatch, automated route tracking, and verified tax reporting.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a routerLink="/auth/register" class="btn-primary py-3.5 px-8 text-sm font-bold rounded-2xl shadow-xl shadow-[#7743DB]/25">
              Get Started Free →
            </a>
            <a routerLink="/auth/login" class="btn-secondary py-3.5 px-8 text-sm font-bold rounded-2xl">
              Sign In to Portal
            </a>
          </div>

          <!-- Quick Metrics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
            @for (stat of stats; track stat.label) {
              <div class="p-6 rounded-3xl bg-[#F7EFE5] border border-[#E8DDD3] shadow-sm text-center">
                <p class="text-2xl sm:text-3xl font-extrabold text-[#7743DB]">{{ stat.value }}</p>
                <span class="text-xs font-semibold text-[#5B5B6A] uppercase tracking-wider block mt-1">{{ stat.label }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Role Cards Selection Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">Built for Every Stakeholder</h2>
          <p class="text-sm text-[#5B5B6A] mt-2">Select your organization type to explore specialized features</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (role of roles; track role.title) {
            <div class="glass-card p-6 rounded-3xl border border-[#E8DDD3] flex flex-col justify-between space-y-4 hover:border-[#7743DB]/40">
              <div class="space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-[#7743DB]/10 text-2xl flex items-center justify-center">
                  {{ role.icon }}
                </div>
                <h3 class="font-extrabold text-lg text-[#1A1A1A]">{{ role.title }}</h3>
                <p class="text-xs text-[#5B5B6A] leading-relaxed">{{ role.description }}</p>
              </div>
              <a routerLink="/auth/register" [queryParams]="{ role: role.roleKey }" class="text-xs font-bold text-[#7743DB] hover:underline flex items-center gap-1">
                Join as {{ role.title }} →
              </a>
            </div>
          }
        </div>
      </section>

      <!-- Features Showcase Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-[#E8DDD3] bg-gradient-to-br from-[#F7EFE5] to-[#FFFBF5]">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <span class="badge badge-primary">AI Matching Engine</span>
              <h2 class="text-3xl font-extrabold text-[#1A1A1A] leading-tight">
                Automated Logistics & Direct Food Rescue Routing
              </h2>
              <p class="text-sm text-[#5B5B6A] leading-relaxed">
                Our algorithm matches perishable food listings with nearest verified NGOs and available courier volunteers, cutting pickup latency by 65%.
              </p>
              <div class="space-y-3">
                @for (feat of features; track feat) {
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center text-xs font-bold">✓</div>
                    <span class="text-xs font-semibold text-[#1A1A1A]">{{ feat }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="p-6 rounded-3xl bg-[#1A1A1A] text-white space-y-6 shadow-2xl border border-white/10">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[#C3ACD0]">Live Activity Stream</span>
                <span class="pulse-dot"></span>
              </div>
              <div class="space-y-3">
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex justify-between items-center">
                  <span>Grand Hyatt • 50 kg Gourmet Meals</span>
                  <span class="text-[#22C55E] font-semibold">Rescued</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex justify-between items-center">
                  <span>St. Jude Shelter • Request #941</span>
                  <span class="text-[#F59E0B] font-semibold">In Transit</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex justify-between items-center">
                  <span>Volunteer Courier Alex</span>
                  <span class="text-[#C3ACD0] font-semibold">Assigned</span>
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
