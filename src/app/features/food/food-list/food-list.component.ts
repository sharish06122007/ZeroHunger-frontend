import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { SocketService } from '../../../core/services/socket.service';
import { Food } from '../../../core/models/food.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

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
  selector: 'app-food-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="space-y-10 pb-12" @fadeIn>
      <!-- Premium Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-[11px] font-bold text-brand-primary mb-3">
            <span class="w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
            LIVE RESCUE FEED
          </div>
          <h1 class="text-4xl font-black text-brand-text tracking-tighter mt-1">Food Rescue Listings</h1>
          <p class="text-sm text-brand-textSec mt-1">Discover surplus food available for immediate claim or volunteer dispatch</p>
        </div>
        <a routerLink="/dashboard/food/create" class="btn-primary py-3 px-6 text-sm font-bold shadow-premium-hover">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          Post Surplus Food
        </a>
      </div>

      <!-- Filters & Search Bar -->
      <div class="zh-card p-5 flex flex-col md:flex-row gap-4 items-center">
        <!-- Search Input -->
        <div class="relative flex-1 w-full">
          <svg class="w-5 h-5 text-brand-textSec absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by food title, donor, or city..."
            class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 pl-12 pr-4 text-sm text-brand-text placeholder-brand-textSec focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            [(ngModel)]="searchQuery"
            (input)="applyFilters()"
          />
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex flex-wrap gap-3 w-full md:w-auto">
          <select class="bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary transition-all" [(ngModel)]="selectedCategory" (change)="applyFilters()">
            <option value="">All Categories</option>
            <option value="cooked">Cooked Meals</option>
            <option value="raw">Raw Produce</option>
            <option value="packaged">Packaged Items</option>
            <option value="bakery">Bakery & Pastry</option>
            <option value="beverage">Beverage</option>
          </select>

          <select class="bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary transition-all" [(ngModel)]="selectedStatus" (change)="applyFilters()">
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="collected">Collected</option>
          </select>

          <button (click)="resetFilters()" class="btn-secondary h-[46px] px-5 text-sm font-semibold">Reset</button>
        </div>
      </div>

      <!-- Cards Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="animate-shimmer h-[400px] rounded-[24px]"></div>
          <div class="animate-shimmer h-[400px] rounded-[24px]"></div>
          <div class="animate-shimmer h-[400px] rounded-[24px]"></div>
        </div>
      } @else if (filteredFood().length === 0) {
        <div class="zh-card p-16 text-center space-y-4">
          <div class="w-24 h-24 mx-auto bg-brand-bg rounded-full flex items-center justify-center">
            <span class="text-5xl block">🍱</span>
          </div>
          <h3 class="font-extrabold text-xl text-brand-text">No Food Rescue Listings Found</h3>
          <p class="text-sm text-brand-textSec">Adjust your search query or reset active filters</p>
          <button (click)="resetFilters()" class="btn-secondary mt-4">Clear Filters</button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (food of filteredFood(); track food._id) {
            <div
              [routerLink]="['/dashboard/food', food._id]"
              class="zh-card p-0 flex flex-col group cursor-pointer border-brand-borderLight hover:border-brand-primary/30"
            >
              <!-- Food Image -->
              <div class="relative h-48 overflow-hidden rounded-t-[24px]">
                <img [src]="food.imageUrl || 'https://images.unsplash.com/photo-149883716733f-a5189f1af408?auto=format&fit=crop&q=80&w=800'" alt="{{food.title}}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <!-- Status Badge Overlay -->
                <div class="absolute top-4 right-4">
                  <span class="px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white shadow-lg backdrop-blur-md" 
                    [ngClass]="food.status === 'available' ? 'bg-brand-success/90 border border-white/20' : 'bg-brand-gold/90 border border-white/20'">
                    {{ food.status }}
                  </span>
                </div>
                
                <!-- Urgency Indicator / Distance Overlay -->
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div class="flex items-center gap-1.5 text-xs font-bold px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg">
                    <svg class="w-3.5 h-3.5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Expires {{ food.expiryTime | date:'shortTime' }}
                  </div>
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-2 py-1 rounded bg-brand-primary/10 text-brand-primary text-[10px] uppercase font-bold tracking-wider">{{ food.category }}</span>
                </div>

                <h3 class="font-bold text-lg text-brand-text group-hover:text-brand-primary transition-colors leading-tight mb-2">
                  {{ food.title }}
                </h3>
                
                <p class="text-sm text-brand-textSec line-clamp-2 leading-relaxed mb-4 flex-1">
                  {{ food.description || 'Verified surplus food donation ready for pickup.' }}
                </p>

                <!-- Key Metrics row -->
                <div class="grid grid-cols-2 gap-4 py-4 border-t border-brand-borderLight text-sm">
                  <div>
                    <span class="block text-[11px] text-brand-textSec font-semibold uppercase tracking-wider mb-1">Quantity</span>
                    <span class="font-bold text-brand-text flex items-center gap-1.5">📦 {{ food.quantity }}</span>
                  </div>
                  <div>
                    <span class="block text-[11px] text-brand-textSec font-semibold uppercase tracking-wider mb-1">Location</span>
                    <span class="font-bold text-brand-text flex items-center gap-1.5 truncate">📍 {{ food.city || 'Mumbai' }}</span>
                  </div>
                </div>
                
                <!-- Donor Info Row -->
                <div class="pt-4 border-t border-brand-borderLight flex items-center justify-between">
                  <div class="flex items-center gap-2 overflow-hidden">
                    <div class="w-6 h-6 rounded-full bg-brand-bgWarm border border-brand-border flex items-center justify-center shrink-0">
                      <span class="text-[10px]">🏢</span>
                    </div>
                    <span class="text-xs font-semibold text-brand-text truncate">{{ food.restaurantName || food.donatedBy?.fullName || 'Anonymous Donor' }}</span>
                  </div>
                  <button class="btn-primary h-8 px-4 text-[11px] rounded-lg shadow-none group-hover:shadow-premium-hover transition-all shrink-0">
                    Rescue
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class FoodListComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly socket = inject(SocketService);

  readonly isLoading = signal(true);
  readonly allFood = signal<Food[]>([]);
  readonly filteredFood = signal<Food[]>([]);
  private socketSub!: Subscription;

  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.fetchFood();
    this.listenToSocket();
  }

  fetchFood(): void {
    this.isLoading.set(true);
    this.apiService.get<any>('food', { limit: 30 }).subscribe({
      next: (res) => {
        const data = res?.data || res;
        const items = extractArray<Food>(data);
        this.allFood.set(items);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private listenToSocket(): void {
    this.socketSub = this.socket.eventStream$.subscribe(({ event, data }) => {
      if (event.startsWith('food:')) {
        this.fetchFood();
        this.toast.info('Listing Updated 🍱', 'Real-time food listings updated.');
      }
    });
  }

  applyFilters(): void {
    const raw = this.allFood();
    let items = Array.isArray(raw) ? [...raw] : [];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(
        f =>
          f.title?.toLowerCase().includes(q) ||
          f.city?.toLowerCase().includes(q) ||
          f.donatedBy?.fullName?.toLowerCase().includes(q) ||
          f.restaurantName?.toLowerCase().includes(q)
      );
    }
    if (this.selectedCategory) {
      items = items.filter(f => f.category === this.selectedCategory);
    }
    if (this.selectedStatus) {
      items = items.filter(f => f.status === this.selectedStatus);
    }
    this.filteredFood.set(items);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  ngOnDestroy(): void {
    if (this.socketSub) this.socketSub.unsubscribe();
  }
}
