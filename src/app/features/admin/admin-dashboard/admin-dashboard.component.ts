import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { SocketService } from '../../../core/services/socket.service';
import { LocationService } from '../../../core/services/location.service';
import { AnalyticsChartsComponent, ChartBarItem } from '../../../shared/components/charts/analytics-charts.component';
import { MapViewComponent } from '../../../shared/components/map-view/map-view.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

interface SystemAnalytics {
  totalDonations: number;
  todaysDonations: number;
  pendingRequests: number;
  completedDeliveries: number;
  availableFood: number;
  activeVolunteers: number;
  activeNgos: number;
  mealsRescued: number;
  usersRegistered: number;
  liveRescueOperations: number;
  pendingPickup: number;
  cancelledDonations: number;
  foodWasteSavedKg: number;
  co2SavedKg: number;
  successRate: number;
  monthlyGrowth: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AnalyticsChartsComponent, MapViewComponent],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="space-y-8 pb-12" @fadeIn>
      <!-- Admin Header -->
      <div class="p-8 rounded-[32px] bg-gradient-hero text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/10">
        <div class="absolute inset-0 bg-brand-darker/20 mix-blend-overlay"></div>
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-extrabold text-white border border-white/15">
            <span class="w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
            REAL-TIME SYSTEM CONTROL
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">Welcome back, Admin 👋</h1>
          <p class="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
            Manage donations, requests, volunteers, NGOs and rescue operations in real time.
          </p>
        </div>

        <div class="relative z-10 flex items-center gap-3">
          <button (click)="refreshAllData()" class="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 px-5 text-xs font-bold rounded-2xl transition-all shadow-xl">
            🔄 Live Sync
          </button>
        </div>
      </div>

      <!-- Real-Time Location Card -->
      <div class="zh-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-2xl font-bold">
            📍
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-extrabold text-sm text-brand-text">Current Service Location</h4>
              @if (loc().status === 'granted') {
                <span class="badge bg-brand-success/10 text-brand-success text-[10px] font-bold">✓ Live GPS Active</span>
              } @else if (loc().status === 'denied') {
                <span class="badge bg-brand-danger/10 text-brand-danger text-[10px] font-bold">⚠️ Geolocation Denied</span>
              } @else {
                <span class="badge bg-brand-primary/10 text-brand-primary text-[10px] font-bold">Detecting...</span>
              }
            </div>
            <p class="text-xs text-brand-textSec font-semibold mt-1">{{ loc().formattedAddress }}</p>
            @if (loc().latitude && loc().longitude) {
              <p class="text-[10px] text-brand-primary font-mono mt-0.5">
                Lat: {{ loc().latitude?.toFixed(4) }} | Long: {{ loc().longitude?.toFixed(4) }} | Accuracy: ±{{ loc().accuracy }}m
              </p>
            }
          </div>
        </div>

        <div class="flex items-center gap-3">
          @if (loc().status === 'denied') {
            <button (click)="enableLocation()" class="btn-primary text-xs font-bold py-2 px-4 rounded-xl">
              Enable Location 📍
            </button>
          } @else {
            <button (click)="enableLocation()" class="btn-secondary text-xs font-semibold py-2 px-4 rounded-xl">
              🔄 Refresh GPS
            </button>
          }
        </div>
      </div>

      @if (loc().latitude && loc().longitude) {
        <div class="zh-card p-2 rounded-[32px] overflow-hidden">
          <div class="h-64 w-full rounded-[24px] overflow-hidden">
            <app-map-view
              [centerLat]="loc().latitude!"
              [centerLng]="loc().longitude!"
              [zoom]="13"
            ></app-map-view>
          </div>
        </div>
      }

      <!-- 16 Real-Time System Overview Cards -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-black text-xl text-brand-text">Real-Time System Overview</h3>
          <span class="text-xs text-brand-textSec font-semibold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></span>
            Live updates active
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- 1. Total Donations -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Total Donations</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🍱</span>
            </div>
            <p class="text-3xl font-black text-brand-text">{{ stats().totalDonations }}</p>
            <span class="text-[11px] font-semibold text-brand-success">↑ Total registered items</span>
          </div>

          <!-- 2. Today's Donations -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Today's Donations</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">☀️</span>
            </div>
            <p class="text-3xl font-black text-brand-text">{{ stats().todaysDonations }}</p>
            <span class="text-[11px] font-semibold text-brand-success">↑ Logged today</span>
          </div>

          <!-- 3. Pending Requests -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-gold/50">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Pending Requests</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">⏳</span>
            </div>
            <p class="text-3xl font-black text-brand-gold">{{ stats().pendingRequests }}</p>
            <span class="text-[11px] font-semibold text-brand-gold">Needs dispatch</span>
          </div>

          <!-- 4. Completed Deliveries -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-emerald/50">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Completed Deliveries</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">✅</span>
            </div>
            <p class="text-3xl font-black text-brand-emerald">{{ stats().completedDeliveries }}</p>
            <span class="text-[11px] font-semibold text-brand-emerald">Fulfilled successfully</span>
          </div>

          <!-- 5. Available Food -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Available Food</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🟢</span>
            </div>
            <p class="text-3xl font-black text-brand-primary">{{ stats().availableFood }}</p>
            <span class="text-[11px] font-semibold text-brand-primary">Ready for pickup</span>
          </div>

          <!-- 6. Active Volunteers -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Active Volunteers</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🚴</span>
            </div>
            <p class="text-3xl font-black text-brand-text">{{ stats().activeVolunteers }}</p>
            <span class="text-[11px] font-semibold text-brand-success">On active duty</span>
          </div>

          <!-- 7. Active NGOs -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Active NGOs</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🏢</span>
            </div>
            <p class="text-3xl font-black text-brand-text">{{ stats().activeNgos }}</p>
            <span class="text-[11px] font-semibold text-brand-success">Verified partners</span>
          </div>

          <!-- 8. Meals Rescued -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Meals Rescued</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🎁</span>
            </div>
            <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-impact">{{ stats().mealsRescued }}</p>
            <span class="text-[11px] font-semibold text-brand-success">Total portions served</span>
          </div>

          <!-- 9. Users Registered -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Users Registered</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">👥</span>
            </div>
            <p class="text-3xl font-black text-brand-text">{{ stats().usersRegistered }}</p>
            <span class="text-[11px] font-semibold text-brand-success">All ecosystem roles</span>
          </div>

          <!-- 10. Live Rescue Operations -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-gold/50">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Live Rescue Ops</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🚨</span>
            </div>
            <p class="text-3xl font-black text-brand-gold">{{ stats().liveRescueOperations }}</p>
            <span class="text-[11px] font-semibold text-brand-gold">In-transit right now</span>
          </div>

          <!-- 11. Pending Pickup -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-indigo/50">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Pending Pickup</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">📦</span>
            </div>
            <p class="text-3xl font-black text-brand-indigo">{{ stats().pendingPickup }}</p>
            <span class="text-[11px] font-semibold text-brand-indigo">Awaiting volunteer</span>
          </div>

          <!-- 12. Cancelled Donations -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-danger/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Cancelled / Expired</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">⚠️</span>
            </div>
            <p class="text-3xl font-black text-brand-danger">{{ stats().cancelledDonations }}</p>
            <span class="text-[11px] font-semibold text-brand-danger">Unclaimed surplus</span>
          </div>

          <!-- 13. Food Waste Saved -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Food Waste Saved</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">♻️</span>
            </div>
            <p class="text-3xl font-black text-brand-success">{{ stats().foodWasteSavedKg }} <span class="text-xs">kg</span></p>
            <span class="text-[11px] font-semibold text-brand-success">Diverted from landfills</span>
          </div>

          <!-- 14. CO₂ Saved -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>CO₂ Saved</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🌱</span>
            </div>
            <p class="text-3xl font-black text-brand-success">{{ stats().co2SavedKg }} <span class="text-xs">kg</span></p>
            <span class="text-[11px] font-semibold text-brand-success">Carbon offset</span>
          </div>

          <!-- 15. Success Rate -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Success Rate</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🎯</span>
            </div>
            <p class="text-3xl font-black text-brand-success">{{ stats().successRate }}%</p>
            <span class="text-[11px] font-semibold text-brand-success">Delivery fulfillment</span>
          </div>

          <!-- 16. Monthly Growth -->
          <div class="zh-card p-6 space-y-2 group hover:border-brand-primary/30">
            <div class="flex justify-between items-center text-xs font-bold text-brand-textSec">
              <span>Monthly Growth</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">📈</span>
            </div>
            <p class="text-3xl font-black text-brand-primary">+{{ stats().monthlyGrowth }}%</p>
            <span class="text-[11px] font-semibold text-brand-primary">vs Previous month</span>
          </div>
        </div>
      </div>

      <!-- Real-Time Analytics Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="zh-card p-6 sm:p-8">
          <app-analytics-charts
            title="Daily Donations & Rescues (Last 7 Days)"
            chartType="area"
            [data]="dailyChartData()"
          ></app-analytics-charts>
        </div>

        <div class="zh-card p-6 sm:p-8">
          <app-analytics-charts
            title="Food Categories Surplus Breakdown"
            chartType="bar"
            [data]="categoryChartData()"
          ></app-analytics-charts>
        </div>
      </div>

      <!-- Platform User Management & Role Control -->
      <div class="zh-card p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="font-extrabold text-xl text-brand-text">Platform Users & Role Permissions</h3>
            <p class="text-xs text-brand-textSec">Manage registered donors, NGOs, volunteers, and restaurants</p>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto relative">
            <svg class="w-4 h-4 text-brand-textSec absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search user by name, email..."
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full sm:w-64 bg-brand-bgWarm border border-brand-borderLight rounded-xl py-2 pl-9 pr-4 text-xs text-brand-text focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border border-brand-borderLight">
          <table class="w-full text-left text-xs text-brand-text">
            <thead class="bg-brand-bgWarm text-brand-textSec font-bold uppercase tracking-wider text-[10px] border-b border-brand-borderLight">
              <tr>
                <th class="py-4 px-6">User / Organization</th>
                <th class="py-4 px-6">Email</th>
                <th class="py-4 px-6">Role</th>
                <th class="py-4 px-6">Location</th>
                <th class="py-4 px-6">Verification</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-borderLight bg-white">
              @for (user of usersList(); track user._id) {
                <tr class="hover:bg-brand-bgWarm/50 transition-colors">
                  <td class="py-4 px-6 font-bold text-brand-text">
                    <div>{{ user.fullName }}</div>
                    @if (user.organizationName) {
                      <div class="text-[10px] text-brand-textSec font-normal">{{ user.organizationName }}</div>
                    }
                  </td>
                  <td class="py-4 px-6 font-mono text-brand-textSec">{{ user.email }}</td>
                  <td class="py-4 px-6">
                    <span class="badge bg-brand-primary/10 text-brand-primary uppercase text-[10px] font-bold">{{ user.role }}</span>
                  </td>
                  <td class="py-4 px-6 text-brand-textSec">{{ user.city || 'Mumbai' }}</td>
                  <td class="py-4 px-6">
                    <span class="badge text-[10px] font-bold" [ngClass]="user.isVerified ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-gold/10 text-brand-gold'">
                      {{ user.isVerified ? 'Verified' : 'Pending' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right space-x-2">
                    <button (click)="toggleVerify(user)" class="btn-secondary h-8 px-3 text-[10px] rounded-lg">
                      {{ user.isVerified ? 'Unverify' : 'Verify ✓' }}
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-8 text-center text-xs text-brand-textSec">
                    No platform users found matching your search.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly socket = inject(SocketService);
  private readonly locationService = inject(LocationService);

  readonly loc = this.locationService.location;
  private socketSub!: Subscription;

  readonly stats = signal<SystemAnalytics>({
    totalDonations: 48,
    todaysDonations: 12,
    pendingRequests: 5,
    completedDeliveries: 36,
    availableFood: 18,
    activeVolunteers: 14,
    activeNgos: 9,
    mealsRescued: 1840,
    usersRegistered: 82,
    liveRescueOperations: 4,
    pendingPickup: 3,
    cancelledDonations: 1,
    foodWasteSavedKg: 828,
    co2SavedKg: 2070,
    successRate: 98.4,
    monthlyGrowth: 24,
  });

  readonly dailyChartData = signal<ChartBarItem[]>([]);
  readonly categoryChartData = signal<ChartBarItem[]>([]);
  readonly usersList = signal<any[]>([]);
  readonly searchQuery = signal('');

  ngOnInit(): void {
    this.refreshAllData();
    this.listenToSocketUpdates();
  }

  refreshAllData(): void {
    this.fetchAnalytics();
    this.fetchCharts();
    this.fetchUsers();
  }

  enableLocation(): void {
    this.locationService.detectLocation();
  }

  fetchAnalytics(): void {
    this.api.get<any>('dashboard/analytics').subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data) {
          this.stats.set(data);
        }
      },
      error: () => {},
    });
  }

  fetchCharts(): void {
    this.api.get<any>('dashboard/charts').subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data?.dailyDonations) {
          this.dailyChartData.set(
            data.dailyDonations.map((d: any) => ({ label: d.label, value: d.donations }))
          );
        }
        if (data?.foodByCategory) {
          this.categoryChartData.set(
            data.foodByCategory.map((c: any) => ({ label: c.category, value: c.count }))
          );
        }
      },
      error: () => {},
    });
  }

  fetchUsers(): void {
    const search = this.searchQuery();
    this.api.get<any>('dashboard/users', { search }).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.usersList.set(data?.users || []);
      },
      error: () => {},
    });
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.fetchUsers();
  }

  toggleVerify(user: any): void {
    const newStatus = !user.isVerified;
    this.api.put(`dashboard/users/${user._id}`, { isVerified: newStatus }).subscribe({
      next: () => {
        this.toast.success('User Status Updated', `${user.fullName} verification updated.`);
        this.fetchUsers();
      },
    });
  }

  private listenToSocketUpdates(): void {
    this.socketSub = this.socket.eventStream$.subscribe(({ event }) => {
      if (event === 'analytics:update' || event.startsWith('food:') || event.startsWith('mission:')) {
        this.fetchAnalytics();
        this.fetchCharts();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.socketSub) {
      this.socketSub.unsubscribe();
    }
  }
}
