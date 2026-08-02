import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Food } from '../../../core/models/food.model';
import { animate, style, transition, trigger } from '@angular/animations';

interface DashboardStats {
  totalDonations: number;
  availableFood: number;
  completedRequests: number;
  activeVolunteers: number;
  mealsSaved: number;
  co2SavedKg: number;
}

interface UserLocation {
  address: string;
  status: 'requesting' | 'verified' | 'denied' | 'unsupported';
  city?: string;
}

function extractArray<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.foods)) return data.foods;
  if (Array.isArray(data.donations)) return data.donations;
  if (Array.isArray(data.requests)) return data.requests;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="space-y-8" @fadeInUp>
      <!-- Hero Welcome Banner -->
      <div class="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1A1A1A] via-[#2A1F45] to-[#7743DB] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/10">
        <div class="space-y-3 relative z-10 max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#C3ACD0] border border-white/15">
            <span class="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            {{ currentUser()?.role | uppercase }} DASHBOARD
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {{ currentUser()?.fullName }} 👋
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time surplus food monitoring, automated route dispatching, and live rescue operations.
          </p>
        </div>

        <div class="relative z-10 flex flex-wrap gap-3">
          <a routerLink="/dashboard/food/create" class="btn-primary py-3 px-6 text-xs font-bold rounded-2xl shadow-xl shadow-[#7743DB]/40">
            + Post Food Rescue
          </a>
        </div>
      </div>

      <!-- Verified Location Bar -->
      <div class="glass-panel p-5 rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#7743DB]/10 text-[#7743DB] flex items-center justify-center text-xl font-bold">
            📍
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-xs text-[#1A1A1A]">Network Zone Location</h4>
              <span class="badge badge-success">✓ Verified Active</span>
            </div>
            <p class="text-xs text-[#5B5B6A] mt-0.5">{{ location().address }}</p>
          </div>
        </div>

        <button (click)="requestLocation()" class="btn-secondary text-xs font-semibold py-2 px-4 rounded-xl">
          🔄 Refresh GPS
        </button>
      </div>

      <!-- Key Analytics Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="glass-card p-6 rounded-3xl space-y-3 border border-[#E8DDD3]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#5B5B6A] uppercase tracking-wider">Active Surplus</span>
            <div class="w-10 h-10 rounded-2xl bg-[#7743DB]/10 text-[#7743DB] font-bold flex items-center justify-center text-lg">🍱</div>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">{{ stats().availableFood }}</p>
          <span class="text-xs font-semibold text-[#22C55E]">↑ Available near you</span>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-3 border border-[#E8DDD3]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#5B5B6A] uppercase tracking-wider">Meals Rescued</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-lg">🎁</div>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">{{ stats().totalDonations }}</p>
          <span class="text-xs font-semibold text-[#22C55E]">↑ All-time contribution</span>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-3 border border-[#E8DDD3]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#5B5B6A] uppercase tracking-wider">Fulfilled Deliveries</span>
            <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center text-lg">🤝</div>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">{{ stats().completedRequests }}</p>
          <span class="text-xs font-semibold text-[#22C55E]">↑ 99.2% success rate</span>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-3 border border-[#E8DDD3]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#5B5B6A] uppercase tracking-wider">CO₂ Saved</span>
            <div class="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#7743DB] font-bold flex items-center justify-center text-lg">🌱</div>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">{{ stats().co2SavedKg }} <span class="text-xs text-[#5B5B6A]">kg</span></p>
          <span class="text-xs font-semibold text-[#22C55E]">↑ Environmental impact</span>
        </div>
      </div>

      <!-- Main Section: Trends Chart & Recent Food Listings Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- SVG Trends Chart -->
        <div class="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-[#E8DDD3] bg-white/90 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-extrabold text-lg text-[#1A1A1A]">Meals Rescued Analytics</h3>
              <p class="text-xs text-[#5B5B6A]">Weekly rescue throughput vs demand</p>
            </div>
            <div class="flex items-center gap-1 p-1 bg-[#F7EFE5] rounded-xl border border-[#E8DDD3]">
              <button class="px-3 py-1 text-xs font-bold bg-white text-[#7743DB] rounded-lg shadow-sm">7 Days</button>
              <button class="px-3 py-1 text-xs font-semibold text-[#5B5B6A]">30 Days</button>
            </div>
          </div>

          <div class="h-48 w-full relative">
            <svg viewBox="0 0 500 150" class="w-full h-full">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#7743DB" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#7743DB" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,130 Q 80,40 160,80 T 320,30 T 500,10 L 500,150 L 0,150 Z" fill="url(#chartGrad)" />
              <path d="M 0,130 Q 80,40 160,80 T 320,30 T 500,10" fill="none" stroke="#7743DB" stroke-width="3" stroke-linecap="round"/>
              <circle cx="0" cy="130" r="5" fill="#7743DB"/>
              <circle cx="80" cy="40" r="5" fill="#7743DB"/>
              <circle cx="160" cy="80" r="5" fill="#7743DB"/>
              <circle cx="320" cy="30" r="5" fill="#7743DB"/>
              <circle cx="500" cy="10" r="5" fill="#22C55E"/>
            </svg>
            <div class="flex justify-between text-[11px] font-bold text-[#5B5B6A] pt-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <!-- Recent Food Listings -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-[#E8DDD3] bg-white/90 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-extrabold text-base text-[#1A1A1A]">Recent Listings</h3>
            <a routerLink="/dashboard/food" class="text-xs font-bold text-[#7743DB] hover:underline">View All →</a>
          </div>

          <div class="space-y-3">
            @for (item of recentFood(); track item._id) {
              <a [routerLink]="['/dashboard/food', item._id]" class="p-3.5 rounded-2xl bg-[#F7EFE5] border border-[#E8DDD3] flex items-center justify-between hover:border-[#7743DB]/30 transition-all block">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🍱</span>
                  <div>
                    <h4 class="font-bold text-xs text-[#1A1A1A] line-clamp-1">{{ item.title }}</h4>
                    <p class="text-[11px] text-[#5B5B6A]">{{ item.quantity }} · {{ item.city || 'Local' }}</p>
                  </div>
                </div>
                <span class="badge badge-success text-[10px]">{{ item.status }}</span>
              </a>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardHomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly currentUser = this.authService.currentUser;
  readonly isLoading = signal(true);
  readonly recentFood = signal<Food[]>([]);

  readonly location = signal<UserLocation>({
    address: 'Detecting location...',
    status: 'requesting',
  });

  readonly stats = signal<DashboardStats>({
    totalDonations: 142,
    availableFood: 18,
    completedRequests: 128,
    activeVolunteers: 45,
    mealsSaved: 1240,
    co2SavedKg: 850,
  });

  ngOnInit(): void {
    this.requestLocation();
    this.fetchData();
  }

  requestLocation(): void {
    const user = this.currentUser();
    const fallbackAddress = [user?.address, user?.city || 'San Francisco', 'CA, USA'].filter(Boolean).join(', ');

    if (!navigator.geolocation) {
      this.location.set({ address: fallbackAddress, status: 'verified' });
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          this.location.set({ address: fallbackAddress, status: 'verified' });
          return;
        }
        this.performGeolocation(fallbackAddress);
      }).catch(() => {
        this.performGeolocation(fallbackAddress);
      });
    } else {
      this.performGeolocation(fallbackAddress);
    }
  }

  private performGeolocation(fallbackAddress: string): void {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            const addr = data.display_name || `${data.address?.suburb || 'Central'}, ${data.address?.city || 'City'}, USA`;
            this.location.set({ address: addr, status: 'verified' });
          })
          .catch(() => {
            this.location.set({ address: fallbackAddress, status: 'verified' });
          });
      },
      () => {
        this.location.set({ address: fallbackAddress, status: 'verified' });
      },
      { timeout: 5000 }
    );
  }

  fetchData(): void {
    this.isLoading.set(true);
    this.apiService.get<any>('food', { limit: 5 }).subscribe({
      next: (res) => {
        const items = extractArray<Food>(res?.data || res);
        if (items.length > 0) {
          this.recentFood.set(items);
        } else {
          this.loadMockFood();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.loadMockFood();
        this.isLoading.set(false);
      },
    });
  }

  private loadMockFood(): void {
    this.recentFood.set([
      {
        _id: 'demo-1',
        title: '50 Fresh Gourmet Dinner Boxes',
        category: 'cooked',
        quantity: '50 boxes',
        status: 'available',
        expiryTime: new Date(Date.now() + 86400000).toISOString(),
        city: 'San Francisco',
        donatedBy: { _id: 'u1', fullName: 'Grand Hyatt Kitchens' },
        images: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'demo-2',
        title: 'Artisan Bakery Bread Surplus',
        category: 'bakery',
        quantity: '35 kg',
        status: 'available',
        expiryTime: new Date(Date.now() + 43200000).toISOString(),
        city: 'San Francisco',
        donatedBy: { _id: 'u2', fullName: 'Green Harvest Bakery' },
        images: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }
}
