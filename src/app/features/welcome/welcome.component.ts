import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, stagger, query } from '@angular/animations';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(24px)' }),
          stagger(100, [
            animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <app-navbar />

    <main class="min-h-screen bg-[var(--bg-main)] relative overflow-hidden font-sans text-[var(--text-main)]">
      <!-- Ambient Background Gradients -->
      <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- 1. HERO SECTION -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10 flex flex-col lg:flex-row items-center gap-12" @fadeUp>
        <div class="flex-1 space-y-8 stagger-item">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--primary)] shadow-sm">
            <span class="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
            HOME FOOD COMMUNITY & RESCUE PLATFORM
          </div>
          <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Turning Food <br />
            <span class="text-transparent bg-clip-text bg-[var(--grad-hero)]">Into Hope.</span>
          </h1>
          <p class="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl leading-relaxed font-medium">
            Connect surplus food, homemade meals, communities, NGOs, and volunteers through one trusted platform.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <a routerLink="/auth/register" class="btn-primary h-14 px-8 text-lg rounded-2xl">
              Get Started
            </a>
            <a routerLink="/auth/login" class="btn-secondary h-14 px-8 text-lg rounded-2xl border-none shadow-none bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-main)] hover:text-[var(--primary)]">
              Explore Impact →
            </a>
          </div>
        </div>
        <div class="flex-1 relative w-full stagger-item hidden lg:block">
          <div class="absolute inset-0 bg-[var(--grad-premium)] blur-3xl opacity-20 rounded-full"></div>
          <div class="relative w-full h-[500px] rounded-[32px] overflow-hidden zh-card p-2 border border-white/20 bg-white/40 backdrop-blur-xl">
             <!-- Placeholder for a beautiful community imagery -->
             <img src="assets/images/hero-community.jpg" alt="Community Food Rescue" class="w-full h-full object-cover rounded-[24px]" onerror="this.src='https://images.unsplash.com/photo-1593113565694-c676714f17ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"/>
             
             <!-- Floating Stat Card -->
             <div class="absolute bottom-6 left-6 zh-card p-4 bg-white/90 backdrop-blur-md flex items-center gap-4 shadow-2xl">
               <div class="w-12 h-12 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center text-xl">
                 🎁
               </div>
               <div>
                 <p class="font-extrabold text-[var(--text-main)] text-lg">1,250+</p>
                 <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Meals Rescued Today</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      <!-- 2. TRUST SECTION -->
      <section class="border-y border-[var(--border-color)] bg-[var(--bg-surface)] py-8 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <!-- Trust Badges -->
          <div class="flex items-center gap-2 font-bold text-[var(--text-muted)] text-sm tracking-widest uppercase"><span class="text-xl">🛡️</span> Verified Partners</div>
          <div class="flex items-center gap-2 font-bold text-[var(--text-muted)] text-sm tracking-widest uppercase"><span class="text-xl">🔒</span> Secure Platform</div>
          <div class="flex items-center gap-2 font-bold text-[var(--text-muted)] text-sm tracking-widest uppercase"><span class="text-xl">📍</span> Real-Time Tracking</div>
          <div class="flex items-center gap-2 font-bold text-[var(--text-muted)] text-sm tracking-widest uppercase"><span class="text-xl">🤝</span> Community Driven</div>
        </div>
      </section>

      <!-- 3. PROBLEM & SOLUTION (HOW IT WORKS) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight">The Ecosystem of <span class="text-[var(--primary)]">Giving</span></h2>
          <p class="text-lg text-[var(--text-muted)]">We bridge the gap between food waste and food insecurity through technology.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="zh-card text-center p-8 space-y-6">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-[var(--danger)]/10 text-[var(--danger)] flex items-center justify-center text-3xl">🗑️</div>
            <h3 class="font-extrabold text-xl">The Problem</h3>
            <p class="text-sm text-[var(--text-muted)] leading-relaxed">Tons of edible surplus food is discarded daily by commercial kitchens and households, while local communities face food insecurity.</p>
          </div>
          <div class="zh-card text-center p-8 space-y-6 transform md:-translate-y-4 border-[var(--primary)]/30 shadow-[var(--shadow-glow)]">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-3xl">📱</div>
            <h3 class="font-extrabold text-xl">Our Solution</h3>
            <p class="text-sm text-[var(--text-muted)] leading-relaxed">A real-time logistics platform matching surplus and homemade food directly with nearby NGOs and courier volunteers automatically.</p>
          </div>
          <div class="zh-card text-center p-8 space-y-6">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center text-3xl">🌱</div>
            <h3 class="font-extrabold text-xl">The Impact</h3>
            <p class="text-sm text-[var(--text-muted)] leading-relaxed">Zero waste, lower carbon footprint, and nourished communities built on trust, transparency, and collaboration.</p>
          </div>
        </div>
      </section>

      <!-- 4. FOOD RESCUE & HOME FOOD (Core Features) -->
      <section class="py-24 bg-[var(--dark)] text-white relative z-10 overflow-hidden">
        <div class="absolute inset-0 bg-[var(--grad-hero)] opacity-10"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
          
          <!-- Food Rescue -->
          <div class="flex flex-col lg:flex-row items-center gap-16">
            <div class="flex-1 space-y-6">
              <span class="px-3 py-1 bg-[var(--primary)]/20 text-[var(--accent)] text-xs font-bold rounded-full border border-[var(--primary)]/30">Food Rescue Module</span>
              <h2 class="text-4xl font-extrabold leading-tight">Instantly Dispatch <br/>Surplus Meals</h2>
              <p class="text-[var(--text-light)] text-lg leading-relaxed">Commercial kitchens can list surplus food in seconds. Our algorithm instantly alerts nearby NGOs and assigns a volunteer courier for rapid, safe delivery before expiry.</p>
              <ul class="space-y-3 pt-4">
                <li class="flex items-center gap-3 font-medium text-sm text-[var(--text-light)]"><span class="text-[var(--success)]">✓</span> Automated matching engine</li>
                <li class="flex items-center gap-3 font-medium text-sm text-[var(--text-light)]"><span class="text-[var(--success)]">✓</span> Real-time GPS tracking</li>
                <li class="flex items-center gap-3 font-medium text-sm text-[var(--text-light)]"><span class="text-[var(--success)]">✓</span> Food safety & expiry tagging</li>
              </ul>
            </div>
            <div class="flex-1 w-full relative">
              <div class="zh-card bg-[var(--sidebar)] border-white/10 p-6 shadow-2xl rounded-3xl relative">
                <!-- Mockup of Rescue Card -->
                <div class="flex gap-4 items-center mb-4 pb-4 border-b border-white/10">
                  <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">🍱</div>
                  <div>
                    <h4 class="font-bold text-white">Grand Hyatt • 50 Gourmet Meals</h4>
                    <p class="text-xs text-[var(--text-light)]">Expires in 2 hours • 1.2 miles away</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-[var(--warning)] px-2 py-1 bg-[var(--warning)]/10 rounded-md">Pending Pickup</span>
                  <button class="btn-primary h-8 px-4 text-xs rounded-lg">Accept Rescue</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Home Food Community -->
          <div class="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div class="flex-1 space-y-6">
              <span class="px-3 py-1 bg-[var(--success)]/20 text-[var(--success)] text-xs font-bold rounded-full border border-[var(--success)]/30">Home Food Module</span>
              <h2 class="text-4xl font-extrabold leading-tight">Share Homemade <br/>Goodness</h2>
              <p class="text-[var(--text-light)] text-lg leading-relaxed">Empower local home cooks to share or sell their traditional, healthy homemade meals to students and busy professionals in the community.</p>
              <ul class="space-y-3 pt-4">
                <li class="flex items-center gap-3 font-medium text-sm text-[var(--text-light)]"><span class="text-[var(--accent)]">✓</span> Verified home food makers</li>
                <li class="flex items-center gap-3 font-medium text-sm text-[var(--text-light)]"><span class="text-[var(--accent)]">✓</span> Customizable subscriptions</li>
                <li class="flex items-center gap-3 font-medium text-sm text-[var(--text-light)]"><span class="text-[var(--accent)]">✓</span> Secure payments & chat</li>
              </ul>
            </div>
            <div class="flex-1 w-full relative">
               <div class="zh-card bg-[var(--sidebar)] border-white/10 p-6 shadow-2xl rounded-3xl relative">
                <div class="flex gap-4 items-center mb-4 pb-4 border-b border-white/10">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--primary)] via-[var(--primary-indigo)] to-[var(--accent)] p-[2px]">
                     <img src="assets/images/avatar.jpg" class="w-full h-full rounded-full object-cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0Ii8+PHBhdGggZD0iTTQgMjBhOCA4IDAgMCAxIDE2IDBIMHoiLz48L3N2Zz4='"/>
                  </div>
                  <div>
                    <h4 class="font-bold text-white">Mrs. Sharma's Kitchen</h4>
                    <p class="text-xs text-[var(--text-light)]">★ 4.9 • Authentic North Indian</p>
                  </div>
                </div>
                <button class="w-full btn-secondary h-10 border-white/20 bg-white/5 text-white hover:bg-white/10">View Menu</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. STAKEHOLDERS (For Donors, NGOs, Volunteers, Makers) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Built for Every Stakeholder</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="zh-card p-6 space-y-4 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] text-2xl flex items-center justify-center">🏪</div>
            <h3 class="font-extrabold text-lg">For Donors</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">Clear surplus inventory easily. Receive automated tax receipts and impact reports for CSR goals.</p>
          </div>
          <div class="zh-card p-6 space-y-4 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-[var(--success)]/10 text-[var(--success)] text-2xl flex items-center justify-center">🏢</div>
            <h3 class="font-extrabold text-lg">For NGOs</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">Request specific bulk food, track incoming deliveries on a live map, and feed beneficiaries reliably.</p>
          </div>
          <div class="zh-card p-6 space-y-4 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] text-2xl flex items-center justify-center">🚴</div>
            <h3 class="font-extrabold text-lg">For Volunteers</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">Accept rescue missions nearby. Use built-in navigation and earn rescue points on the leaderboard.</p>
          </div>
          <div class="zh-card p-6 space-y-4 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-[var(--warning)]/10 text-[var(--warning)] text-2xl flex items-center justify-center">👩‍🍳</div>
            <h3 class="font-extrabold text-lg">For Makers</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">Monetize your cooking skills. Manage orders, delivery partners, and payments from one dashboard.</p>
          </div>
        </div>
      </section>

      <!-- 6. STATISTICS & IMPACT -->
      <section class="bg-[var(--bg-warm)] py-24 border-y border-[var(--border-color)] relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 class="text-3xl font-extrabold">Our Global Impact</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p class="text-5xl font-black text-[var(--primary)]">184K</p>
              <p class="text-sm font-bold text-[var(--text-muted)] mt-2 uppercase tracking-wide">Meals Rescued</p>
            </div>
            <div>
              <p class="text-5xl font-black text-[var(--accent)]">82</p>
              <p class="text-sm font-bold text-[var(--text-muted)] mt-2 uppercase tracking-wide">Tons CO₂ Saved</p>
            </div>
            <div>
              <p class="text-5xl font-black text-[var(--success)]">450+</p>
              <p class="text-sm font-bold text-[var(--text-muted)] mt-2 uppercase tracking-wide">NGO Partners</p>
            </div>
            <div>
              <p class="text-5xl font-black text-[var(--warning)]">1.2K</p>
              <p class="text-sm font-bold text-[var(--text-muted)] mt-2 uppercase tracking-wide">Active Couriers</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. COMMUNITY STORIES -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Community Stories</h2>
          <p class="text-lg text-[var(--text-muted)] mt-4">Real impact created by our network every day.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Story 1 -->
          <div class="zh-card p-8 space-y-6 flex flex-col justify-between">
            <p class="text-sm italic text-[var(--text-muted)] leading-relaxed">"Before ZeroHunger, we struggled to find reliable logistics for our leftover banquet food. Now, a volunteer arrives within 20 minutes of us posting."</p>
            <div class="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
              <div class="w-10 h-10 rounded-full bg-[var(--primary)]/10"></div>
              <div>
                <h4 class="font-bold text-sm">Chef Marcus</h4>
                <p class="text-[10px] text-[var(--text-light)] uppercase font-semibold">Food Donor</p>
              </div>
            </div>
          </div>
          <!-- Story 2 -->
          <div class="zh-card p-8 space-y-6 flex flex-col justify-between">
            <p class="text-sm italic text-[var(--text-muted)] leading-relaxed">"As a university student away from home, the Home Food network gave me access to authentic meals that remind me of my mother's cooking."</p>
            <div class="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
              <div class="w-10 h-10 rounded-full bg-[var(--accent)]/10"></div>
              <div>
                <h4 class="font-bold text-sm">Priya M.</h4>
                <p class="text-[10px] text-[var(--text-light)] uppercase font-semibold">Student</p>
              </div>
            </div>
          </div>
          <!-- Story 3 -->
          <div class="zh-card p-8 space-y-6 flex flex-col justify-between">
            <p class="text-sm italic text-[var(--text-muted)] leading-relaxed">"The platform's live tracking allows our shelter to prepare exactly for what's arriving. It completely eliminated uncertainty in our feeding program."</p>
            <div class="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
              <div class="w-10 h-10 rounded-full bg-[var(--success)]/10"></div>
              <div>
                <h4 class="font-bold text-sm">Sarah Jenkins</h4>
                <p class="text-[10px] text-[var(--text-light)] uppercase font-semibold">NGO Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. CTA SECTION -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div class="zh-card p-12 text-center rounded-[40px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-indigo)] text-white shadow-2xl border-none">
          <h2 class="text-4xl font-extrabold mb-6">Ready to make a difference?</h2>
          <p class="text-lg text-white/80 max-w-2xl mx-auto mb-10">Join thousands of donors, volunteers, and makers transforming the food ecosystem today.</p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a routerLink="/auth/register" class="btn-secondary h-14 px-8 text-lg rounded-2xl bg-white text-[var(--primary)] hover:bg-[var(--bg-surface)]">
              Create Free Account
            </a>
            <a routerLink="/auth/login" class="btn-primary h-14 px-8 text-lg rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 shadow-none">
              Sign In
            </a>
          </div>
        </div>
      </section>

    </main>
    <app-footer />
  `,
})
export class WelcomeComponent {
}
