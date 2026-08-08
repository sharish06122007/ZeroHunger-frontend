import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';
import { LucideAngularModule } from 'lucide-angular';
import { ZhCardComponent } from '../../../shared/components/ui/zh-card/zh-card.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';
import { ZhBadgeComponent } from '../../../shared/components/ui/zh-badge/zh-badge.component';
import { MapViewComponent } from '../../../shared/components/map-view/map-view.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-delivery-partner-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ZhCardComponent, ZhButtonComponent, ZhBadgeComponent, MapViewComponent],
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
          <h1 class="text-3xl font-extrabold text-brand-text tracking-tight">Delivery Dashboard</h1>
          <p class="text-brand-muted mt-1">Accept deliveries, view routes, and track your earnings.</p>
        </div>
        <div class="flex items-center gap-3">
          <app-zh-badge [variant]="isOnline() ? 'success' : 'default'">
            <div class="flex items-center gap-1.5">
               <div class="w-2 h-2 rounded-full" [ngClass]="isOnline() ? 'bg-brand-fresh animate-pulse' : 'bg-brand-muted'"></div>
               {{ isOnline() ? 'Online' : 'Offline' }}
            </div>
          </app-zh-badge>
          <app-zh-button [variant]="isOnline() ? 'outline' : 'primary'" (onClick)="isOnline.set(!isOnline())">
            {{ isOnline() ? 'Go Offline' : 'Go Online' }}
          </app-zh-button>
        </div>
      </div>

      <!-- Quick Earnings & Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-zh-card [hoverLift]="true" class="bg-brand-primary text-white border-none shadow-lg">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-primary-light uppercase tracking-wider">Today's Earnings</span>
              <div class="w-10 h-10 rounded-xl bg-white/20 text-white font-bold flex items-center justify-center">
                <lucide-icon name="banknote" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-white">₹850</p>
            <span class="text-xs font-semibold text-brand-primary-light flex items-center gap-1">
              +₹120 from tips
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Completed Trips</span>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                <lucide-icon name="check-circle-2" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">12</p>
            <span class="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <lucide-icon name="trending-up" class="w-3 h-3"></lucide-icon> Today
            </span>
          </div>
        </app-zh-card>

        <app-zh-card [hoverLift]="true">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Distance Covered</span>
              <div class="w-10 h-10 rounded-xl bg-brand-accent-soft text-brand-accent-warm font-bold flex items-center justify-center">
                <lucide-icon name="navigation" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <p class="text-3xl font-extrabold text-brand-text">42 <span class="text-lg">km</span></p>
            <span class="text-xs font-semibold text-brand-accent-warm flex items-center gap-1">
              Today
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
            <p class="text-3xl font-extrabold text-brand-text">4.8</p>
            <span class="text-xs font-semibold text-amber-500 flex items-center gap-1">
              Top 10% Delivery Partner
            </span>
          </div>
        </app-zh-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Live Map & Route (Mock) -->
        <div class="lg:col-span-2 space-y-4">
           <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-lg text-brand-text">Active Route Map</h3>
           </div>
           <app-zh-card [noPadding]="true" class="overflow-hidden">
              <div class="h-[400px] w-full bg-brand-bg relative">
                 <!-- The MapViewComponent requires coordinates. Mocking with Mumbai -->
                 <app-map-view 
                    [latitude]="19.0760" 
                    [longitude]="72.8777" 
                    [markers]="[{lat: 19.0760, lng: 72.8777, title: 'Pickup'}, {lat: 19.0800, lng: 72.8800, title: 'Dropoff'}]"
                    height="400px">
                 </app-map-view>
                 
                 <!-- Overlay Map Actions -->
                 <div class="absolute bottom-4 left-4 right-4 z-[400] flex justify-between gap-4">
                    <div class="bg-white p-3 rounded-2xl shadow-lg border border-brand-border flex items-center gap-3">
                       <div class="w-10 h-10 bg-brand-primary-very-light text-brand-primary rounded-xl flex items-center justify-center">
                          <lucide-icon name="navigation" class="w-5 h-5"></lucide-icon>
                       </div>
                       <div>
                         <p class="text-xs font-bold text-brand-muted">Next Stop</p>
                         <p class="text-sm font-extrabold text-brand-text">2.4 km away (8 mins)</p>
                       </div>
                    </div>
                    <button class="bg-brand-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-primary-dark transition-colors">
                       <lucide-icon name="focus" class="w-6 h-6"></lucide-icon>
                    </button>
                 </div>
              </div>
           </app-zh-card>
        </div>

        <!-- Available Deliveries -->
        <div class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-extrabold text-lg text-brand-text flex items-center gap-2">
              <lucide-icon name="list" class="w-5 h-5 text-brand-primary"></lucide-icon>
              New Requests
            </h3>
          </div>

          <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            @if (!isOnline()) {
              <div class="p-8 text-center text-brand-muted border-2 border-dashed border-brand-border rounded-2xl">
                <lucide-icon name="power-off" class="w-10 h-10 mx-auto mb-3 opacity-50"></lucide-icon>
                <p>You are offline.</p>
                <p class="text-xs mt-1">Go online to start receiving orders.</p>
              </div>
            } @else if (deliveries.length === 0) {
              <div class="p-8 text-center text-brand-muted border-2 border-dashed border-brand-border rounded-2xl">
                <lucide-icon name="search" class="w-10 h-10 mx-auto mb-3 opacity-50 animate-pulse"></lucide-icon>
                <p>Looking for orders...</p>
              </div>
            }

            @for (delivery of deliveries; track delivery.id) {
              <app-zh-card [noPadding]="true">
                <div class="p-5">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <app-zh-badge variant="info">Order #{{ delivery.id }}</app-zh-badge>
                      <h4 class="font-bold text-brand-text mt-2 line-clamp-1">{{ delivery.title }}</h4>
                    </div>
                    <div class="text-right">
                       <span class="font-extrabold text-brand-primary text-lg">₹{{ delivery.earning }}</span>
                       <span class="block text-[10px] text-brand-muted">Est. Earning</span>
                    </div>
                  </div>
                  
                  <div class="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-brand-border">
                     <div class="relative flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-brand-primary-very-light border-2 border-brand-primary flex items-center justify-center shrink-0 z-10">
                           <div class="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                        </div>
                        <div class="text-xs">
                           <p class="font-bold text-brand-text">Pickup: {{ delivery.pickup }}</p>
                           <p class="text-brand-muted">{{ delivery.pickupDist }} km away</p>
                        </div>
                     </div>
                     <div class="relative flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-brand-accent-soft border-2 border-brand-accent-warm flex items-center justify-center shrink-0 z-10">
                           <lucide-icon name="map-pin" class="w-3 h-3 text-brand-accent-warm"></lucide-icon>
                        </div>
                        <div class="text-xs">
                           <p class="font-bold text-brand-text">Drop: {{ delivery.dropoff }}</p>
                           <p class="text-brand-muted">{{ delivery.dropDist }} km trip</p>
                        </div>
                     </div>
                  </div>

                  <div class="mt-5">
                    <app-zh-button variant="primary" [fullWidth]="true" (onClick)="acceptDelivery(delivery.id)">Accept Delivery</app-zh-button>
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
export class DeliveryPartnerDashboardComponent implements OnInit {
  readonly isOnline = signal(true);
  
  deliveries = [
     { id: '1042', title: '5x Vegetarian Meals', pickup: '123 Maker Street', dropoff: '456 Customer Ave', pickupDist: 1.2, dropDist: 3.5, earning: 40 },
     { id: '1043', title: '2x Chicken Curry Combos', pickup: '88 Spice Kitchen', dropoff: '12 Tech Park', pickupDist: 0.8, dropDist: 5.1, earning: 65 }
  ];

  constructor(private homeFoodService: HomeFoodService) {}

  ngOnInit() {
    // In a real app, we would fetch available deliveries via Socket or API
  }
  
  acceptDelivery(id: string) {
    alert(`Accepted delivery #${id}! Map updated with new route.`);
    this.deliveries = this.deliveries.filter(d => d.id !== id);
  }
}
