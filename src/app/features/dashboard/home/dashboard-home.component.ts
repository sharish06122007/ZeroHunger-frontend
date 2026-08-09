import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { SocketService } from '../../../core/services/socket.service';
import { LocationService } from '../../../core/services/location.service';
import { Food } from '../../../core/models/food.model';
import { MapViewComponent } from '../../../shared/components/map-view/map-view.component';
import { AnalyticsChartsComponent } from '../../../shared/components/charts/analytics-charts.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

interface HomeAnalytics {
  totalDonations: number;
  availableFood: number;
  completedDeliveries: number;
  activeVolunteers: number;
  mealsRescued: number;
  co2SavedKg: number;
  foodWasteSavedKg: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MapViewComponent, AnalyticsChartsComponent],
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
      <div class="p-8 sm:p-10 rounded-[32px] bg-gradient-to-r from-[var(--primary)] via-[var(--primary-indigo)] to-[var(--accent)] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-none">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="space-y-3 relative z-10 max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-extrabold text-[var(--secondary)] border border-white/15">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {{ currentUser()?.role | uppercase }} DASHBOARD
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">
            {{ greeting() }}, {{ currentUser()?.fullName?.split(' ')?.[0] || 'User' }} 👋
          </h1>
          <p class="text-xs sm:text-sm text-white/80 leading-relaxed">
            Real-time surplus food monitoring, automated route dispatching, and live rescue operations.
          </p>
        </div>

        <div class="relative z-10 flex flex-wrap gap-3">
          <a routerLink="/dashboard/food/create" class="btn-primary">
            + Post Food Rescue
          </a>
        </div>
      </div>

      <!-- Current Service Location Bar -->
      <div class="zh-card p-5 bg-[var(--bg-surface)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xl font-bold">
            📍
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-xs text-[var(--text-main)]">Current Service Location</h4>
              @if (loc().status === 'granted') {
                <span class="badge badge-success text-[10px]">✓ Live Geolocation Verified</span>
              } @else if (loc().status === 'denied') {
                <span class="badge badge-danger text-[10px]">Location Denied</span>
              } @else {
                <span class="badge badge-primary text-[10px]">Detecting...</span>
              }
            </div>
            <p class="text-xs text-[var(--text-muted)] font-medium mt-0.5">{{ loc().formattedAddress }}</p>
          </div>
        </div>

        <button (click)="refreshLocation()" class="btn-secondary">
          🔄 Refresh GPS
        </button>
      </div>

      <!-- Key Analytics Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="zh-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Surplus</span>
            <div class="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center text-lg">🍱</div>
          </div>
          <p class="text-3xl font-black text-[var(--text-main)]">{{ stats().availableFood }}</p>
          <span class="text-xs font-semibold text-[var(--success)]">↑ Live available items</span>
        </div>

        <div class="zh-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Meals Rescued</span>
            <div class="w-10 h-10 rounded-2xl bg-[var(--success)]/10 text-[var(--success)] font-bold flex items-center justify-center text-lg">🎁</div>
          </div>
          <p class="text-3xl font-black text-[var(--text-main)]">{{ stats().mealsRescued }}</p>
          <span class="text-xs font-semibold text-[var(--success)]">↑ Total portions served</span>
        </div>

        <div class="zh-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Fulfilled Deliveries</span>
            <div class="w-10 h-10 rounded-2xl bg-[var(--warning)]/10 text-[var(--warning)] font-bold flex items-center justify-center text-lg">🤝</div>
          </div>
          <p class="text-3xl font-black text-[var(--text-main)]">{{ stats().completedDeliveries }}</p>
          <span class="text-xs font-semibold text-[var(--success)]">↑ Verified complete</span>
        </div>

        <div class="zh-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">CO₂ Offset</span>
            <div class="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center text-lg">🌱</div>
          </div>
          <p class="text-3xl font-black text-[var(--text-main)]">{{ stats().co2SavedKg }} <span class="text-xs text-[var(--text-muted)]">kg</span></p>
          <span class="text-xs font-semibold text-[var(--success)]">↑ Environmental impact</span>
        </div>
      </div>

      <!-- Main Section: Trends Chart & Recent Food Listings Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Live Analytics Chart -->
        <div class="lg:col-span-2 zh-card p-6 sm:p-8 space-y-6">
          <app-analytics-charts
            title="Weekly Rescue Throughput vs Demand"
            chartType="line"
            [data]="chartPoints()"
          ></app-analytics-charts>
        </div>

        <!-- Recent Food Listings -->
        <div class="zh-card p-6 sm:p-8 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-extrabold text-base text-[var(--text-main)]">Recent Listings</h3>
            <a routerLink="/dashboard/food" class="text-xs font-bold text-[var(--primary)] hover:underline">View All →</a>
          </div>

          <div class="space-y-3">
            @for (item of recentFood(); track item._id) {
              <a [routerLink]="['/dashboard/food', item._id]" class="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between hover:border-[var(--primary)]/30 transition-all block">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🍱</span>
                  <div>
                    <h4 class="font-bold text-xs text-[var(--text-main)] line-clamp-1">{{ item.title }}</h4>
                    <p class="text-[11px] text-[var(--text-muted)]">{{ item.quantity }} · {{ item.city || 'Mumbai' }}</p>
                  </div>
                </div>
                <span class="badge badge-success text-[10px]">{{ item.status }}</span>
              </a>
            } @empty {
              <div class="p-6 text-center text-xs text-[var(--text-muted)]">
                No listings yet. Post a surplus food donation to rescue meals!
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly socket = inject(SocketService);
  private readonly locationService = inject(LocationService);

  readonly currentUser = this.authService.currentUser;
  readonly loc = this.locationService.location;
  readonly recentFood = signal<Food[]>([]);
  readonly greeting = signal<string>('Good morning');
  private socketSub!: Subscription;

  readonly stats = signal<HomeAnalytics>({
    totalDonations: 48,
    availableFood: 18,
    completedDeliveries: 36,
    activeVolunteers: 14,
    mealsRescued: 1840,
    co2SavedKg: 2070,
    foodWasteSavedKg: 828,
  });

  readonly chartPoints = signal([
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 24 },
    { label: 'Wed', value: 18 },
    { label: 'Thu', value: 32 },
    { label: 'Fri', value: 45 },
    { label: 'Sat', value: 28 },
    { label: 'Sun', value: 38 },
  ]);

  ngOnInit(): void {
    this.updateGreeting();
    this.fetchData();
    this.listenToSocket();
  }

  updateGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting.set('Good morning');
    else if (hour < 18) this.greeting.set('Good afternoon');
    else this.greeting.set('Good evening');
  }

  refreshLocation(): void {
    this.locationService.detectLocation();
  }

  fetchData(): void {
    this.apiService.get<any>('dashboard/analytics').subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data) this.stats.set(data);
      },
      error: () => {},
    });

    this.apiService.get<any>('food', { limit: 5 }).subscribe({
      next: (res) => {
        const data = res?.data || res;
        const foods = Array.isArray(data) ? data : data?.foods || [];
        this.recentFood.set(foods);
      },
      error: () => {},
    });
  }

  private listenToSocket(): void {
    this.socketSub = this.socket.eventStream$.subscribe(({ event }) => {
      if (event === 'analytics:update' || event.startsWith('food:')) {
        this.fetchData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.socketSub) this.socketSub.unsubscribe();
  }
}
