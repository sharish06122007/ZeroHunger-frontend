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
      <div class="p-8 rounded-3xl bg-gradient-to-r from-[#1A1A1A] via-[#2A1F45] to-[#7743DB] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/10">
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-extrabold text-[#C3ACD0] border border-white/15">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            REAL-TIME SYSTEM CONTROL
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight">Welcome back, Admin 👋</h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage donations, requests, volunteers, NGOs and rescue operations in real time.
          </p>
        </div>

        <div class="relative z-10 flex items-center gap-3">
          <button (click)="refreshAllData()" class="btn-primary py-3 px-5 text-xs font-bold rounded-2xl shadow-xl shadow-[#7743DB]/40">
            🔄 Live Sync
          </button>
        </div>
      </div>

      <!-- Real-Time Location Card -->
      <div class="glass-panel p-6 rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-md space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-[#7743DB]/10 text-[#7743DB] flex items-center justify-center text-2xl font-bold">
              📍
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-extrabold text-sm text-[#1A1A1A]">Current Service Location</h4>
                @if (loc().status === 'granted') {
                  <span class="badge badge-success text-[10px]">✓ Live GPS Active</span>
                } @else if (loc().status === 'denied') {
                  <span class="badge badge-danger text-[10px]">⚠️ Geolocation Denied</span>
                } @else {
                  <span class="badge badge-primary text-[10px]">Detecting...</span>
                }
              </div>
              <p class="text-xs text-[#5B5B6A] font-semibold mt-1">{{ loc().formattedAddress }}</p>
              @if (loc().latitude && loc().longitude) {
                <p class="text-[10px] text-[#7743DB] font-mono mt-0.5">
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
          <div class="h-44 w-full">
            <app-map-view
              [centerLat]="loc().latitude!"
              [centerLng]="loc().longitude!"
              [zoom]="13"
            ></app-map-view>
          </div>
        }
      </div>

      <!-- 16 Real-Time System Overview Cards -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-black text-lg text-[#1A1A1A]">Real-Time System Overview</h3>
          <span class="text-xs text-[#5B5B6A] font-semibold">Live updates active</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- 1. Total Donations -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Total Donations</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🍱</span>
            </div>
            <p class="text-3xl font-black text-[#1A1A1A]">{{ stats().totalDonations }}</p>
            <span class="text-[11px] font-semibold text-emerald-600">↑ Total registered items</span>
          </div>

          <!-- 2. Today's Donations -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Today's Donations</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">☀️</span>
            </div>
            <p class="text-3xl font-black text-[#1A1A1A]">{{ stats().todaysDonations }}</p>
            <span class="text-[11px] font-semibold text-emerald-600">↑ Logged today</span>
          </div>

          <!-- 3. Pending Requests -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Pending Requests</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">⏳</span>
            </div>
            <p class="text-3xl font-black text-amber-600">{{ stats().pendingRequests }}</p>
            <span class="text-[11px] font-semibold text-amber-600">Needs dispatch</span>
          </div>

          <!-- 4. Completed Deliveries -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Completed Deliveries</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">✅</span>
            </div>
            <p class="text-3xl font-black text-emerald-600">{{ stats().completedDeliveries }}</p>
            <span class="text-[11px] font-semibold text-emerald-600">Fulfilled successfully</span>
          </div>

          <!-- 5. Available Food -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Available Food</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🟢</span>
            </div>
            <p class="text-3xl font-black text-[#7743DB]">{{ stats().availableFood }}</p>
            <span class="text-[11px] font-semibold text-[#7743DB]">Ready for pickup</span>
          </div>

          <!-- 6. Active Volunteers -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Active Volunteers</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🚴</span>
            </div>
            <p class="text-3xl font-black text-[#1A1A1A]">{{ stats().activeVolunteers }}</p>
            <span class="text-[11px] font-semibold text-emerald-600">On active duty</span>
          </div>

          <!-- 7. Active NGOs -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Active NGOs</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🏢</span>
            </div>
            <p class="text-3xl font-black text-[#1A1A1A]">{{ stats().activeNgos }}</p>
            <span class="text-[11px] font-semibold text-emerald-600">Verified partners</span>
          </div>

          <!-- 8. Meals Rescued -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Meals Rescued</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🎁</span>
            </div>
            <p class="text-3xl font-black text-emerald-600">{{ stats().mealsRescued }}</p>
            <span class="text-[11px] font-semibold text-emerald-600">Total portions served</span>
          </div>

          <!-- 9. Users Registered -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Users Registered</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">👥</span>
            </div>
            <p class="text-3xl font-black text-[#1A1A1A]">{{ stats().usersRegistered }}</p>
            <span class="text-[11px] font-semibold text-emerald-600">All ecosystem roles</span>
          </div>

          <!-- 10. Live Rescue Operations -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Live Rescue Ops</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🚨</span>
            </div>
            <p class="text-3xl font-black text-amber-600">{{ stats().liveRescueOperations }}</p>
            <span class="text-[11px] font-semibold text-amber-600">In-transit right now</span>
          </div>

          <!-- 11. Pending Pickup -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Pending Pickup</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">📦</span>
            </div>
            <p class="text-3xl font-black text-[#7743DB]">{{ stats().pendingPickup }}</p>
            <span class="text-[11px] font-semibold text-[#7743DB]">Awaiting volunteer</span>
          </div>

          <!-- 12. Cancelled Donations -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Cancelled / Expired</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">⚠️</span>
            </div>
            <p class="text-3xl font-black text-red-500">{{ stats().cancelledDonations }}</p>
            <span class="text-[11px] font-semibold text-red-500">Unclaimed surplus</span>
          </div>

          <!-- 13. Food Waste Saved -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Food Waste Saved</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">♻️</span>
            </div>
            <p class="text-3xl font-black text-emerald-600">{{ stats().foodWasteSavedKg }} <span class="text-xs">kg</span></p>
            <span class="text-[11px] font-semibold text-emerald-600">Diverted from landfills</span>
          </div>

          <!-- 14. CO₂ Saved -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>CO₂ Saved</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🌱</span>
            </div>
            <p class="text-3xl font-black text-emerald-600">{{ stats().co2SavedKg }} <span class="text-xs">kg</span></p>
            <span class="text-[11px] font-semibold text-emerald-600">Carbon offset</span>
          </div>

          <!-- 15. Success Rate -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Success Rate</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🎯</span>
            </div>
            <p class="text-3xl font-black text-emerald-600">{{ stats().successRate }}%</p>
            <span class="text-[11px] font-semibold text-emerald-600">Delivery fulfillment</span>
          </div>

          <!-- 16. Monthly Growth -->
          <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3] hover:shadow-xl transition-all group">
            <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
              <span>Monthly Growth</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">📈</span>
            </div>
            <p class="text-3xl font-black text-[#7743DB]">+{{ stats().monthlyGrowth }}%</p>
            <span class="text-[11px] font-semibold text-[#7743DB]">vs Previous month</span>
          </div>
        </div>
      </div>

      <!-- Real-Time Analytics Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-md">
          <app-analytics-charts
            title="Daily Donations & Rescues (Last 7 Days)"
            chartType="area"
            [data]="dailyChartData()"
          ></app-analytics-charts>
        </div>

        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-md">
          <app-analytics-charts
            title="Food Categories Surplus Breakdown"
            chartType="bar"
            [data]="categoryChartData()"
          ></app-analytics-charts>
        </div>
      </div>

      <!-- Platform User Management & Role Control -->
      <div class="glass-panel rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="font-extrabold text-lg text-[#1A1A1A]">Platform Users & Role Permissions</h3>
            <p class="text-xs text-[#5B5B6A]">Manage registered donors, NGOs, volunteers, and restaurants</p>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search user by name, email..."
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              class="form-input text-xs py-2 px-4 rounded-xl border border-[#E8DDD3] w-full sm:w-64"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A1A1A]">
            <thead class="bg-[#F7EFE5] text-[#5B5B6A] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DDD3]">
              <tr>
                <th class="py-4 px-6">User / Organization</th>
                <th class="py-4 px-6">Email</th>
                <th class="py-4 px-6">Role</th>
                <th class="py-4 px-6">Location</th>
                <th class="py-4 px-6">Verification</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8DDD3]">
              @for (user of usersList(); track user._id) {
                <tr class="hover:bg-[#F7EFE5]/50 transition-colors">
                  <td class="py-4 px-6 font-bold text-[#1A1A1A]">
                    <div>{{ user.fullName }}</div>
                    @if (user.organizationName) {
                      <div class="text-[10px] text-[#5B5B6A] font-normal">{{ user.organizationName }}</div>
                    }
                  </td>
                  <td class="py-4 px-6 font-mono text-[#5B5B6A]">{{ user.email }}</td>
                  <td class="py-4 px-6">
                    <span class="badge badge-primary uppercase text-[10px]">{{ user.role }}</span>
                  </td>
                  <td class="py-4 px-6 text-[#5B5B6A]">{{ user.city || 'Mumbai' }}</td>
                  <td class="py-4 px-6">
                    <span class="badge badge-{{ user.isVerified ? 'success' : 'warning' }} text-[10px]">
                      {{ user.isVerified ? 'Verified' : 'Pending' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right space-x-2">
                    <button (click)="toggleVerify(user)" class="btn-secondary py-1 px-3 text-[10px] rounded-lg">
                      {{ user.isVerified ? 'Unverify' : 'Verify ✓' }}
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-8 text-center text-xs text-[#5B5B6A]">
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
