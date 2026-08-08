import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { LucideAngularModule } from 'lucide-angular';
import { ZhCardComponent } from '../../../shared/components/ui/zh-card/zh-card.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';
import { ZhBadgeComponent } from '../../../shared/components/ui/zh-badge/zh-badge.component';

@Component({
  selector: 'app-ngo-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ZhCardComponent, ZhButtonComponent, ZhBadgeComponent],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="space-y-8" @fadeIn>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-brand-text tracking-tight">NGO Operations Hub</h1>
          <p class="text-sm text-brand-muted mt-1">Manage bulk distributions, volunteers, and track your community impact.</p>
        </div>
        <app-zh-button variant="primary" icon="plus" routerLink="/dashboard/requests">
          Post Bulk Request
        </app-zh-button>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Beneficiaries Served</span>
              <div class="w-10 h-10 rounded-xl bg-brand-primary-very-light text-brand-primary font-bold flex items-center justify-center">
                <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">1,450</p>
            <span class="text-xs font-semibold text-brand-primary flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> +12% this month
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Meals Claimed</span>
              <div class="w-10 h-10 rounded-xl bg-brand-accent-soft text-brand-accent-warm font-bold flex items-center justify-center">
                <lucide-icon name="box" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">320</p>
            <span class="text-xs font-semibold text-brand-accent-warm flex items-center gap-1">
              Currently processing
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Distribution Hubs</span>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                <lucide-icon name="map-pin" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">4</p>
            <span class="text-xs font-semibold text-brand-muted flex items-center gap-1">
              Active locations
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Assigned Couriers</span>
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 font-bold flex items-center justify-center">
                <lucide-icon name="truck" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">18</p>
            <span class="text-xs font-semibold text-amber-500 flex items-center gap-1">
              Volunteers & Partners
            </span>
          </div>
        </app-zh-card>
      </div>

      <!-- Active Batches & Impact Log -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between mb-4">
               <h3 class="font-extrabold text-lg text-brand-text">Active Bulk Dispatch Batches</h3>
               <a routerLink="/dashboard/requests" class="text-sm font-bold text-brand-primary hover:underline">Manage All</a>
            </div>

            <app-zh-card [noPadding]="true" class="overflow-x-auto">
               <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[11px] border-b border-brand-border">
                     <tr>
                        <th class="py-4 px-6">Batch Details</th>
                        <th class="py-4 px-6">Source Donor</th>
                        <th class="py-4 px-6">Status</th>
                        <th class="py-4 px-6">Schedule</th>
                        <th class="py-4 px-6"></th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-brand-border bg-white">
                     @for (batch of activeBatches(); track batch.id) {
                        <tr class="hover:bg-brand-bg transition-colors">
                           <td class="py-4 px-6">
                              <p class="font-bold text-brand-text">{{ batch.title }}</p>
                              <p class="text-xs text-brand-muted">{{ batch.qty }}</p>
                           </td>
                           <td class="py-4 px-6">
                              <div class="flex items-center gap-2">
                                 <div class="w-6 h-6 rounded-full bg-brand-primary-very-light flex items-center justify-center shrink-0">
                                    <lucide-icon name="building-2" class="w-3 h-3 text-brand-primary"></lucide-icon>
                                 </div>
                                 <span class="font-semibold text-brand-text text-xs">{{ batch.donor }}</span>
                              </div>
                           </td>
                           <td class="py-4 px-6">
                              <app-zh-badge [variant]="batch.status === 'Dispatched' ? 'success' : 'warning'">
                                 {{ batch.status }}
                              </app-zh-badge>
                           </td>
                           <td class="py-4 px-6 text-brand-muted text-xs font-medium flex items-center gap-2 mt-2">
                              <lucide-icon name="clock" class="w-3 h-3"></lucide-icon>
                              {{ batch.time }}
                           </td>
                           <td class="py-4 px-6 text-right">
                              <button class="text-brand-muted hover:text-brand-primary transition-colors">
                                 <lucide-icon name="more-horizontal" class="w-5 h-5"></lucide-icon>
                              </button>
                           </td>
                        </tr>
                     }
                  </tbody>
               </table>
            </app-zh-card>
         </div>

         <!-- Distribution Logs / Feed -->
         <div class="space-y-4">
            <h3 class="font-extrabold text-lg text-brand-text">Recent Distributions</h3>
            
            <div class="space-y-4">
               @for (log of distributionLogs; track log.id) {
                  <app-zh-card [noPadding]="true">
                     <div class="p-5 flex items-start gap-4">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" 
                             [ngClass]="log.type === 'delivered' ? 'bg-brand-primary-very-light text-brand-primary' : 'bg-brand-accent-soft text-brand-accent-warm'">
                           <lucide-icon [name]="log.type === 'delivered' ? 'check-circle' : 'truck'" class="w-5 h-5"></lucide-icon>
                        </div>
                        <div>
                           <p class="text-sm font-bold text-brand-text">{{ log.title }}</p>
                           <p class="text-xs text-brand-muted mt-1 leading-relaxed">{{ log.desc }}</p>
                           <p class="text-[10px] font-semibold text-brand-muted uppercase tracking-wider mt-2">{{ log.time }}</p>
                        </div>
                     </div>
                  </app-zh-card>
               }
            </div>
            <app-zh-button variant="outline" [fullWidth]="true">View Full Log</app-zh-button>
         </div>
      </div>
    </div>
  `,
})
export class NgoDashboardComponent {
  private readonly toast = inject(ToastService);

  readonly activeBatches = signal([
    { id: '1', title: 'Weekend Shelter Dinner Drive', qty: '200 meals', donor: 'Grand Hyatt Kitchens', status: 'Dispatched', time: 'Today 6:00 PM' },
    { id: '2', title: 'Community Kitchen Staple Package', qty: '150 kg Grains', donor: 'Organic Wholesale Co.', status: 'Reserved', time: 'Tomorrow 10:00 AM' },
    { id: '3', title: 'Orphanage Breakfast Stock', qty: '50 ltr Milk, Bread', donor: 'Daily Fresh Dairy', status: 'Pending', time: 'Mon 6:00 AM' },
  ]);

  readonly distributionLogs = [
     { id: 1, type: 'delivered', title: '100 Meals Delivered', desc: 'Successfully distributed to Dharavi center.', time: '2 hours ago' },
     { id: 2, type: 'transit', title: 'Batch Transit Update', desc: 'Volunteer Rohan picked up 50kg staples from Metro Cash & Carry.', time: '5 hours ago' },
     { id: 3, type: 'delivered', title: 'Daily Rescue Target Met', desc: 'Rescued 30 portions from Taj Lands End.', time: 'Yesterday' }
  ];
}
