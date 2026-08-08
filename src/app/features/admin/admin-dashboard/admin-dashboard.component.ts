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
import { LucideAngularModule } from 'lucide-angular';
import { ZhCardComponent } from '../../../shared/components/ui/zh-card/zh-card.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';
import { ZhBadgeComponent } from '../../../shared/components/ui/zh-badge/zh-badge.component';

interface SystemAnalytics {
  activeUsers: number;
  totalOrders: number;
  totalVolume: number;
  successRate: number;
  liveDeliveries: number;
  pendingVerifications: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AnalyticsChartsComponent, MapViewComponent, LucideAngularModule, ZhCardComponent, ZhButtonComponent, ZhBadgeComponent],
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
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-brand-text tracking-tight flex items-center gap-3">
            Admin Command Center
            <app-zh-badge variant="error">Live Sync</app-zh-badge>
          </h1>
          <p class="text-sm text-brand-muted mt-1">Monitor system health, active deliveries, and platform users.</p>
        </div>
        <div class="flex gap-2">
           <app-zh-button variant="outline" icon="download">Export Data</app-zh-button>
           <app-zh-button variant="primary" icon="refresh-cw" (onClick)="refreshAllData()">Sync Data</app-zh-button>
        </div>
      </div>

      <!-- Live GPS Health -->
      <app-zh-card [noPadding]="true">
        <div class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-brand-primary-very-light text-brand-primary flex items-center justify-center shadow-sm">
              <lucide-icon name="server" class="w-6 h-6"></lucide-icon>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-bold text-sm text-brand-text">System Geolocation Hub</h4>
                @if (loc().status === 'granted') {
                  <app-zh-badge variant="success" icon="check-circle">GPS Active</app-zh-badge>
                } @else if (loc().status === 'denied') {
                  <app-zh-badge variant="error" icon="alert-circle">Denied</app-zh-badge>
                } @else {
                  <app-zh-badge variant="info" icon="loader-2">Detecting...</app-zh-badge>
                }
              </div>
              <p class="text-sm text-brand-muted font-medium">{{ loc().formattedAddress || 'Fetching server location...' }}</p>
            </div>
          </div>

          <app-zh-button *ngIf="loc().status === 'denied'" variant="primary" (onClick)="enableLocation()">Enable Location</app-zh-button>
        </div>

        @if (loc().latitude && loc().longitude) {
          <div class="h-64 w-full bg-brand-bg relative border-t border-brand-border">
            <app-map-view
              [latitude]="loc().latitude!"
              [longitude]="loc().longitude!"
              height="256px"
            ></app-map-view>
          </div>
        }
      </app-zh-card>

      <!-- KPI Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-zh-card [hoverLift]="true" class="border-t-4 border-t-brand-primary">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Active Users</span>
              <div class="w-10 h-10 rounded-xl bg-brand-primary-very-light text-brand-primary font-bold flex items-center justify-center">
                <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().activeUsers }}</p>
            <span class="text-xs font-semibold text-brand-primary flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> +12% this week
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="border-t-4 border-t-blue-500">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Orders</span>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                <lucide-icon name="shopping-bag" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().totalOrders }}</p>
            <span class="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> +5% vs yesterday
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="border-t-4 border-t-emerald-500">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Transaction Volume</span>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
                <lucide-icon name="indian-rupee" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">₹{{ (stats().totalVolume / 1000).toFixed(1) }}k</p>
            <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              MTD Volume
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="border-t-4 border-t-amber-500">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Live Deliveries</span>
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 font-bold flex items-center justify-center">
                <lucide-icon name="truck" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().liveDeliveries }}</p>
            <span class="text-xs font-semibold text-amber-600 flex items-center gap-1">
              Currently in transit
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="border-t-4 border-t-brand-accent-warm">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Pending Verifications</span>
              <div class="w-10 h-10 rounded-xl bg-brand-accent-soft text-brand-accent-warm font-bold flex items-center justify-center">
                <lucide-icon name="shield-alert" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().pendingVerifications }}</p>
            <span class="text-xs font-semibold text-brand-accent-warm flex items-center gap-1">
              Requires admin approval
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="border-t-4 border-t-purple-500">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Success Rate</span>
              <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center">
                <lucide-icon name="target" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().successRate }}%</p>
            <span class="text-xs font-semibold text-purple-600 flex items-center gap-1">
              Order fulfillment
            </span>
          </div>
        </app-zh-card>
      </div>

      <!-- Real-Time Analytics Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <app-zh-card>
          <app-analytics-charts
            title="Order Volume (Last 7 Days)"
            chartType="area"
            [data]="dailyChartData()"
          ></app-analytics-charts>
        </app-zh-card>

        <app-zh-card>
          <app-analytics-charts
            title="Food Category Distribution"
            chartType="bar"
            [data]="categoryChartData()"
          ></app-analytics-charts>
        </app-zh-card>
      </div>

      <!-- Platform User Management -->
      <app-zh-card [noPadding]="true">
        <div class="p-6 border-b border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="font-extrabold text-lg text-brand-text">Platform User Management</h3>
            <p class="text-sm text-brand-muted mt-1">Review and verify makers, NGOs, and delivery partners.</p>
          </div>

          <div class="relative max-w-sm w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <lucide-icon name="search" class="w-4 h-4 text-brand-muted"></lucide-icon>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full pl-10 pr-4 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[11px] border-b border-brand-border">
              <tr>
                <th class="py-4 px-6">User</th>
                <th class="py-4 px-6">Role</th>
                <th class="py-4 px-6">Location</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border bg-white">
              @for (user of usersList(); track user._id) {
                <tr class="hover:bg-brand-bg transition-colors">
                  <td class="py-4 px-6">
                     <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                           {{ user.fullName.charAt(0) }}
                        </div>
                        <div>
                           <p class="font-bold text-brand-text">{{ user.fullName }}</p>
                           <p class="text-xs text-brand-muted">{{ user.email }}</p>
                        </div>
                     </div>
                  </td>
                  <td class="py-4 px-6">
                    <span class="px-2 py-1 bg-brand-bg border border-brand-border rounded-md text-[10px] font-bold uppercase text-brand-text">
                       {{ user.role }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-brand-muted">{{ user.city || 'Anywhere' }}</td>
                  <td class="py-4 px-6">
                     <app-zh-badge [variant]="user.isVerified ? 'success' : 'warning'">
                        {{ user.isVerified ? 'Verified' : 'Pending Review' }}
                     </app-zh-badge>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <app-zh-button variant="outline" size="sm" (onClick)="toggleVerify(user)">
                      {{ user.isVerified ? 'Revoke' : 'Verify' }}
                    </app-zh-button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-8 text-center text-brand-muted">
                     <lucide-icon name="users" class="w-8 h-8 mx-auto mb-2 opacity-30"></lucide-icon>
                    No platform users found matching your search.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </app-zh-card>
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
    activeUsers: 842,
    totalOrders: 2150,
    totalVolume: 845000,
    successRate: 98.4,
    liveDeliveries: 14,
    pendingVerifications: 5
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
    // Mocking analytics for display. Would normally use API here.
    this.stats.set({
       activeUsers: 1042,
       totalOrders: 3254,
       totalVolume: 1254000,
       successRate: 99.1,
       liveDeliveries: 24,
       pendingVerifications: 2
    });
  }

  fetchCharts(): void {
    this.dailyChartData.set([
      { label: 'Mon', value: 120 },
      { label: 'Tue', value: 145 },
      { label: 'Wed', value: 130 },
      { label: 'Thu', value: 180 },
      { label: 'Fri', value: 240 },
      { label: 'Sat', value: 310 },
      { label: 'Sun', value: 290 },
    ]);
    
    this.categoryChartData.set([
      { label: 'Lunch', value: 450 },
      { label: 'Dinner', value: 680 },
      { label: 'Breakfast', value: 210 },
      { label: 'Snacks', value: 150 },
    ]);
  }

  fetchUsers(): void {
    const search = this.searchQuery().toLowerCase();
    
    const mockUsers = [
       { _id: '1', fullName: 'Harish', email: 'admin@zh.com', role: 'admin', isVerified: true, city: 'Mumbai' },
       { _id: '2', fullName: 'Anjali Desai', email: 'anjali@home.com', role: 'home_food_maker', isVerified: true, city: 'Pune' },
       { _id: '3', fullName: 'Ramesh Transport', email: 'ramesh@delivery.com', role: 'delivery_partner', isVerified: false, city: 'Mumbai' },
       { _id: '4', fullName: 'Helping Hands NGO', email: 'contact@helpinghands.org', role: 'ngo', isVerified: true, city: 'Delhi' }
    ];
    
    if (search) {
       this.usersList.set(mockUsers.filter(u => u.fullName.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)));
    } else {
       this.usersList.set(mockUsers);
    }
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.fetchUsers();
  }

  toggleVerify(user: any): void {
    user.isVerified = !user.isVerified;
    this.toast.success('User Status Updated', `${user.fullName} verification updated.`);
    this.usersList.set([...this.usersList()]); // Trigger change detection
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
