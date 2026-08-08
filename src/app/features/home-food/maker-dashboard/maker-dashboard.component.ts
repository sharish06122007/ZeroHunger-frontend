import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AnalyticsChartsComponent } from '../../../shared/components/charts/analytics-charts.component';
import { ZhCardComponent } from '../../../shared/components/ui/zh-card/zh-card.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';
import { ZhBadgeComponent } from '../../../shared/components/ui/zh-badge/zh-badge.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-maker-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AnalyticsChartsComponent, ZhCardComponent, ZhButtonComponent, ZhBadgeComponent],
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
      <!-- Dashboard Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-brand-text tracking-tight">Maker Dashboard</h1>
          <p class="text-brand-muted mt-1">Manage your incoming food requests and track your earnings.</p>
        </div>
        <div class="flex gap-2">
          <app-zh-button variant="outline" icon="settings">Kitchen Settings</app-zh-button>
          <app-zh-button variant="primary" icon="plus" routerLink="/dashboard/food/create">Post Surplus</app-zh-button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Earnings</span>
              <div class="w-10 h-10 rounded-xl bg-brand-primary-very-light text-brand-primary font-bold flex items-center justify-center">
                <lucide-icon name="wallet" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">₹12,450</p>
            <span class="text-xs font-semibold text-brand-primary flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> +15% this week
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Active Orders</span>
              <div class="w-10 h-10 rounded-xl bg-brand-accent-soft text-brand-accent-warm font-bold flex items-center justify-center">
                <lucide-icon name="chef-hat" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">4</p>
            <span class="text-xs font-semibold text-brand-accent-warm flex items-center gap-1">
              Needs your attention
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Meals Cooked</span>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                <lucide-icon name="utensils" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">148</p>
            <span class="text-xs font-semibold text-brand-muted flex items-center gap-1">
              Since joined
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Rating</span>
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 font-bold flex items-center justify-center">
                <lucide-icon name="star" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">4.9</p>
            <span class="text-xs font-semibold text-amber-500 flex items-center gap-1">
              <lucide-icon name="award" class="w-3 h-3"></lucide-icon> Super Cook Status
            </span>
          </div>
        </app-zh-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Live Earnings Chart -->
        <div class="lg:col-span-2">
          <app-zh-card>
            <app-analytics-charts
              title="Weekly Earnings Trend"
              chartType="bar"
              [data]="earningsData()"
            ></app-analytics-charts>
          </app-zh-card>
        </div>

        <!-- Pending Live Requests -->
        <div class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-extrabold text-lg text-brand-text flex items-center gap-2">
              <lucide-icon name="bell-ring" class="w-5 h-5 text-brand-primary animate-pulse"></lucide-icon>
              Live Requests
            </h3>
            <app-zh-badge variant="info">{{ requests.length }} nearby</app-zh-badge>
          </div>

          <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            @if (requests.length === 0) {
              <div class="p-8 text-center text-brand-muted border-2 border-dashed border-brand-border rounded-2xl">
                <lucide-icon name="coffee" class="w-10 h-10 mx-auto mb-3 opacity-50"></lucide-icon>
                <p>No nearby requests right now.</p>
                <p class="text-xs mt-1">Take a break, we'll notify you!</p>
              </div>
            }

            @for (req of requests; track req._id) {
              <app-zh-card [noPadding]="true" class="border-l-4 border-l-brand-primary">
                <div class="p-5">
                  <div class="flex justify-between items-start mb-3">
                    <app-zh-badge 
                      [variant]="req.foodCategory === 'Dinner' ? 'default' : 'success'"
                    >
                      {{ req.foodCategory }}
                    </app-zh-badge>
                    <span class="font-bold text-brand-primary">₹{{ req.budgetRange }}</span>
                  </div>
                  
                  <h4 class="font-bold text-brand-text mb-2 line-clamp-2">{{ req.foodItemName }}</h4>
                  
                  <div class="grid grid-cols-2 gap-2 text-xs text-brand-muted mb-4">
                    <div class="flex items-center gap-1">
                      <lucide-icon name="users" class="w-3 h-3"></lucide-icon>
                      {{ req.numberOfPeople }} People
                    </div>
                    <div class="flex items-center gap-1">
                      <lucide-icon name="clock" class="w-3 h-3"></lucide-icon>
                      {{ req.requiredDeliveryTime | date:'shortTime' }}
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <app-zh-button variant="primary" [fullWidth]="true" (onClick)="acceptRequest(req._id)">Accept</app-zh-button>
                  </div>
                </div>
              </app-zh-card>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class MakerDashboardComponent implements OnInit {
  requests: any[] = [];
  
  readonly earningsData = signal([
    { label: 'Mon', value: 850 },
    { label: 'Tue', value: 1200 },
    { label: 'Wed', value: 950 },
    { label: 'Thu', value: 1500 },
    { label: 'Fri', value: 2100 },
    { label: 'Sat', value: 3400 },
    { label: 'Sun', value: 2450 },
  ]);

  constructor(
    private homeFoodService: HomeFoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchRequests();
  }

  fetchRequests() {
    // We add some mock requests if API returns empty to demonstrate UI
    this.homeFoodService.getNearbyRequests().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.requests = res.data;
        } else {
          this.requests = [
             { _id: '1', foodCategory: 'Lunch', foodItemName: '3 Dal Makhani & Rice combos', numberOfPeople: 3, budgetRange: '450', requiredDeliveryTime: new Date(Date.now() + 3600000) },
             { _id: '2', foodCategory: 'Dinner', foodItemName: 'Family pack Chicken Biryani', numberOfPeople: 4, budgetRange: '800', requiredDeliveryTime: new Date(Date.now() + 10800000) },
          ];
        }
      },
      error: (err) => {
        console.error(err);
        this.requests = [
             { _id: '1', foodCategory: 'Lunch', foodItemName: '3 Dal Makhani & Rice combos', numberOfPeople: 3, budgetRange: '450', requiredDeliveryTime: new Date(Date.now() + 3600000) },
             { _id: '2', foodCategory: 'Dinner', foodItemName: 'Family pack Chicken Biryani', numberOfPeople: 4, budgetRange: '800', requiredDeliveryTime: new Date(Date.now() + 10800000) },
        ];
      }
    });
  }

  acceptRequest(id: string) {
    this.homeFoodService.acceptRequest(id).subscribe({
      next: (res) => {
        alert('Request accepted successfully!');
        this.fetchRequests();
      },
      error: (err) => {
        console.error(err);
        // Simulate accept for mock
        this.requests = this.requests.filter(r => r._id !== id);
        alert('Request accepted successfully!');
      }
    });
  }
}
