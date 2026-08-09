import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-maker-dashboard',
  standalone: true,
  imports: [CommonModule],
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
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-4xl font-black text-brand-text tracking-tighter">Maker Dashboard</h1>
          <p class="text-sm text-brand-textSec mt-1">Accept requests and start preparing fresh home food.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-brand-success/10 text-brand-success rounded-full text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
            Accepting Orders
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="zh-card p-6 bg-brand-bgWarm border-brand-borderLight flex items-center justify-between">
          <div>
            <p class="text-xs text-brand-textSec font-bold uppercase tracking-wider mb-1">Total Earnings</p>
            <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-emerald">₹12,450</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
        <div class="zh-card p-6 bg-brand-bgWarm border-brand-borderLight flex items-center justify-between">
          <div>
            <p class="text-xs text-brand-textSec font-bold uppercase tracking-wider mb-1">Orders Completed</p>
            <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-primary">48</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
        </div>
        <div class="zh-card p-6 bg-brand-bgWarm border-brand-borderLight flex items-center justify-between">
          <div>
            <p class="text-xs text-brand-textSec font-bold uppercase tracking-wider mb-1">Rating</p>
            <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-gold">4.9</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-brand-text mb-6">Nearby Requests</h2>
        
        @if (isLoading) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="animate-shimmer h-48 rounded-2xl"></div>
            <div class="animate-shimmer h-48 rounded-2xl"></div>
          </div>
        } @else if (requests.length === 0) {
          <div class="zh-card p-16 text-center border-brand-borderLight">
            <div class="w-20 h-20 mx-auto bg-brand-bg rounded-full flex items-center justify-center text-brand-textSec mb-4">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
            </div>
            <h3 class="text-lg font-bold text-brand-text">No requests right now</h3>
            <p class="text-sm text-brand-textSec">We'll notify you when a new order comes in your area.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            @for (req of requests; track req._id) {
              <div class="zh-card p-6 flex flex-col group hover:border-brand-primary/30 cursor-pointer">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider" 
                      [ngClass]="{
                        'bg-brand-indigo/10 text-brand-indigo': req.foodCategory === 'Lunch', 
                        'bg-brand-emerald/10 text-brand-emerald': req.foodCategory === 'Dinner', 
                        'bg-brand-gold/10 text-brand-gold': req.foodCategory === 'Breakfast', 
                        'bg-brand-primary/10 text-brand-primary': req.foodCategory === 'Traditional',
                        'bg-brand-success/10 text-brand-success': true
                      }">
                      {{ req.foodCategory }}
                    </span>
                    @if (req.foodPreference && req.foodPreference !== 'Any') {
                      <span class="text-[10px] font-bold uppercase tracking-wider text-brand-emerald border border-brand-emerald/20 px-2 py-1 rounded-md">
                        {{ req.foodPreference }}
                      </span>
                    }
                  </div>
                  <span class="text-lg font-black text-brand-emerald">{{ req.budgetRange }}</span>
                </div>

                <h3 class="text-xl font-bold text-brand-text mb-1">{{ req.foodItemName }}</h3>
                
                <div class="grid grid-cols-2 gap-4 my-6">
                  <div class="flex items-center gap-2 text-sm text-brand-textSec">
                    <span class="text-brand-text">👥</span> {{ req.numberOfPeople }} People
                  </div>
                  <div class="flex items-center gap-2 text-sm text-brand-textSec">
                    <span class="text-brand-text">🕒</span> Due: {{ req.requiredDeliveryTime | date:'shortTime' }}
                  </div>
                  <div class="flex items-center gap-2 text-sm text-brand-textSec">
                    <span class="text-brand-text">📍</span> {{ req.deliveryDistance || '5' }} km away
                  </div>
                  <div class="flex items-center gap-2 text-sm text-brand-textSec">
                    <span class="text-brand-text">🌶️</span> {{ req.spicePreference || 'Medium' }}
                  </div>
                </div>

                @if (req.specialInstructions || req.allergies) {
                  <div class="bg-brand-bgWarm p-3 rounded-xl border border-brand-borderLight text-xs text-brand-textSec mb-6">
                    <span class="font-bold text-brand-danger uppercase">Notes:</span> 
                    {{ req.allergies ? 'Allergies: ' + req.allergies + '. ' : '' }}{{ req.specialInstructions }}
                  </div>
                }

                <div class="mt-auto pt-4 border-t border-brand-borderLight">
                  <button (click)="acceptRequest(req._id)" class="w-full btn-primary h-12 shadow-none group-hover:shadow-premium-hover">
                    Accept Order
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class MakerDashboardComponent implements OnInit {
  requests: any[] = [];
  isLoading = true;

  constructor(
    private homeFoodService: HomeFoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchRequests();
  }

  fetchRequests() {
    this.isLoading = true;
    this.homeFoodService.getNearbyRequests().subscribe({
      next: (res) => {
        this.requests = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  acceptRequest(id: string) {
    this.homeFoodService.acceptRequest(id).subscribe({
      next: (res) => {
        this.fetchRequests();
        if (res?.data?._id) {
          this.router.navigate(['/dashboard/home-food/order', res.data._id]);
        }
      },
      error: (err) => console.error(err)
    });
  }
}
