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
import { LucideAngularModule } from 'lucide-angular';
import { ZhCardComponent } from '../../../shared/components/ui/zh-card/zh-card.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';
import { ZhBadgeComponent } from '../../../shared/components/ui/zh-badge/zh-badge.component';
import { ZhSkeletonComponent } from '../../../shared/components/ui/zh-skeleton/zh-skeleton.component';
import { ZhEmptyStateComponent } from '../../../shared/components/ui/zh-empty-state/zh-empty-state.component';

interface HomeAnalytics {
  activeOrders: number;
  completedOrders: number;
  totalSpent: number;
  savedMakers: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MapViewComponent, 
    AnalyticsChartsComponent, 
    LucideAngularModule,
    ZhCardComponent,
    ZhButtonComponent,
    ZhBadgeComponent,
    ZhSkeletonComponent,
    ZhEmptyStateComponent
  ],
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
      <div class="p-8 sm:p-10 rounded-[32px] bg-brand-primary text-white shadow-premium relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <!-- Background graphics -->
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-brand-primary-light rounded-full blur-[100px] opacity-30"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-accent/30 rounded-full blur-[100px] opacity-30"></div>
        
        <div class="space-y-4 relative z-10 max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white backdrop-blur-sm border border-white/20 uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-brand-fresh animate-pulse"></span>
            {{ currentUser()?.role || 'Customer' }} Dashboard
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {{ currentUser()?.fullName }} 👋
          </h1>
          <p class="text-sm text-brand-primary-very-light leading-relaxed">
            Discover homemade food near you, manage your requests, and track your orders in real-time.
          </p>
        </div>

        <div class="relative z-10 flex flex-wrap gap-3">
          <app-zh-button variant="secondary" routerLink="/dashboard/home-food/customer">
            <lucide-icon name="search" class="w-4 h-4"></lucide-icon> Find Food
          </app-zh-button>
        </div>
      </div>

      <!-- Current Service Location Bar -->
      <app-zh-card [noPadding]="true">
        <div class="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-brand-primary-very-light text-brand-primary flex items-center justify-center shadow-sm">
              <lucide-icon name="map-pin" class="w-6 h-6"></lucide-icon>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-bold text-sm text-brand-text">Delivery Location</h4>
                @if (loc().status === 'granted') {
                  <app-zh-badge variant="success" icon="check-circle">Verified</app-zh-badge>
                } @else if (loc().status === 'denied') {
                  <app-zh-badge variant="error" icon="alert-circle">Denied</app-zh-badge>
                } @else {
                  <app-zh-badge variant="info" icon="loader-2">Detecting...</app-zh-badge>
                }
              </div>
              <p class="text-sm text-brand-muted font-medium">{{ loc().formattedAddress || 'Detecting your location...' }}</p>
            </div>
          </div>

          <app-zh-button variant="outline" (onClick)="refreshLocation()">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Refresh GPS
          </app-zh-button>
        </div>
      </app-zh-card>

      <!-- Key Analytics Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-zh-card [hoverLift]="true" class="h-full">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Active Orders</span>
              <div class="w-10 h-10 rounded-xl bg-brand-accent-soft text-brand-accent-warm font-bold flex items-center justify-center">
                <lucide-icon name="package" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().activeOrders }}</p>
            <span class="text-xs font-semibold text-brand-accent-warm flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> In progress
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="h-full">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Completed Orders</span>
              <div class="w-10 h-10 rounded-xl bg-brand-primary-very-light text-brand-primary font-bold flex items-center justify-center">
                <lucide-icon name="check-circle" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().completedOrders }}</p>
            <span class="text-xs font-semibold text-brand-primary flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> Delivered
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="h-full">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Spent</span>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                <lucide-icon name="wallet" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">₹{{ stats().totalSpent }}</p>
            <span class="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> This month
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true" class="h-full">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Saved Makers</span>
              <div class="w-10 h-10 rounded-xl bg-red-50 text-red-500 font-bold flex items-center justify-center">
                <lucide-icon name="heart" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">{{ stats().savedMakers }}</p>
            <span class="text-xs font-semibold text-red-500 flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> Favorites
            </span>
          </div>
        </app-zh-card>
      </div>

      <!-- Main Section: Recent Activity & Map -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Recommended Food -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-extrabold text-lg text-brand-text">Recommended For You</h3>
            <a routerLink="/dashboard/home-food/customer" class="text-sm font-bold text-brand-primary hover:underline">View All →</a>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            @for (item of recentFood(); track item._id) {
              <app-zh-card [hoverLift]="true" [noPadding]="true">
                <div class="h-40 relative overflow-hidden rounded-t-2xl bg-brand-bg">
                  <img *ngIf="item.image" [src]="item.image" [alt]="item.title" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  <div *ngIf="!item.image" class="w-full h-full flex items-center justify-center text-brand-muted">
                     <lucide-icon name="image" class="w-12 h-12"></lucide-icon>
                  </div>
                  <div class="absolute top-3 right-3">
                    <app-zh-badge variant="success">{{ item.status }}</app-zh-badge>
                  </div>
                </div>
                <div class="p-4">
                  <h4 class="font-bold text-brand-text mb-1 line-clamp-1">{{ item.title }}</h4>
                  <p class="text-sm text-brand-muted mb-4 flex items-center gap-1">
                    <lucide-icon name="map-pin" class="w-3 h-3"></lucide-icon> {{ item.city || 'Nearby' }}
                  </p>
                  <app-zh-button variant="outline" [fullWidth]="true" size="sm">View Details</app-zh-button>
                </div>
              </app-zh-card>
            } @empty {
              <div class="col-span-2">
                <app-zh-empty-state
                  icon="utensils"
                  title="No Recommendations Yet"
                  description="Start requesting food to get personalized recommendations."
                  actionLabel="Find Food"
                  actionIcon="search"
                ></app-zh-empty-state>
              </div>
            }
          </div>
        </div>

        <!-- Active Order Tracking / Map -->
        <div class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-extrabold text-lg text-brand-text">Active Order Tracking</h3>
          </div>
          
          <app-zh-card [noPadding]="true">
            <div class="p-5 border-b border-brand-border bg-brand-primary-very-light/50 rounded-t-2xl">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-brand-muted uppercase">Order #ZH-8472</span>
                <app-zh-badge variant="warning">Preparing</app-zh-badge>
              </div>
              <h4 class="font-bold text-brand-text">Authentic South Indian Thali</h4>
              <p class="text-sm text-brand-muted mt-1">From Lakshmi Iyer</p>
            </div>
            
            <div class="p-6">
              <!-- Simple Timeline UI -->
              <div class="relative pl-6 space-y-6">
                <!-- Line -->
                <div class="absolute left-[9px] top-2 bottom-2 w-0.5 bg-brand-border z-0"></div>
                
                <!-- Completed Step -->
                <div class="relative z-10 flex gap-4">
                  <div class="w-5 h-5 rounded-full bg-brand-primary border-2 border-white shadow-sm flex items-center justify-center shrink-0 -ml-[2px]">
                    <lucide-icon name="check" class="w-3 h-3 text-white"></lucide-icon>
                  </div>
                  <div>
                    <h5 class="font-bold text-sm text-brand-text">Request Accepted</h5>
                    <p class="text-xs text-brand-muted">12:30 PM</p>
                  </div>
                </div>

                <!-- Active Step -->
                <div class="relative z-10 flex gap-4">
                  <div class="w-5 h-5 rounded-full bg-brand-accent-warm border-2 border-white shadow-sm flex items-center justify-center shrink-0 -ml-[2px] animate-pulse">
                    <div class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h5 class="font-bold text-sm text-brand-accent-warm">Food Preparation</h5>
                    <p class="text-xs text-brand-muted">Estimated 20 mins</p>
                  </div>
                </div>

                <!-- Upcoming Step -->
                <div class="relative z-10 flex gap-4">
                  <div class="w-5 h-5 rounded-full bg-white border-2 border-brand-border shrink-0 -ml-[2px]"></div>
                  <div>
                    <h5 class="font-bold text-sm text-brand-muted">Out for Delivery</h5>
                  </div>
                </div>
              </div>

              <div class="mt-8 pt-4 border-t border-brand-border">
                <app-zh-button variant="primary" [fullWidth]="true">Track Delivery Map</app-zh-button>
              </div>
            </div>
          </app-zh-card>
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
  readonly recentFood = signal<any[]>([]);
  private socketSub!: Subscription;

  readonly stats = signal<HomeAnalytics>({
    activeOrders: 1,
    completedOrders: 12,
    totalSpent: 4250,
    savedMakers: 4,
  });

  ngOnInit(): void {
    this.fetchData();
    this.listenToSocket();
  }

  refreshLocation(): void {
    this.locationService.detectLocation();
  }

  fetchData(): void {
    // Mocking recent food items for the new UI to prevent blank states
    this.recentFood.set([
      { _id: '1', title: 'Punjabi Rajma Chawal', city: 'Andheri West', status: 'Available', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' },
      { _id: '2', title: 'Home-style Chicken Curry', city: 'Bandra', status: 'Pre-order', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600' }
    ]);

    // Keep the real API call commented out or active if backend supports it
    /*
    this.apiService.get<any>('food', { limit: 4 }).subscribe({
      next: (res) => {
        const data = res?.data || res;
        const foods = Array.isArray(data) ? data : data?.foods || [];
        if (foods.length > 0) this.recentFood.set(foods);
      },
      error: () => {},
    });
    */
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
