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
    <div class="space-y-8 pb-12" @fadeIn>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE REAL-TIME FEED
          </div>
          <h1 class="text-3xl font-black text-[var(--text-main)] tracking-tight mt-1">Food Rescue Listings</h1>
          <p class="text-xs text-[var(--text-muted)]">Surplus food available for immediate claim and volunteer dispatch</p>
        </div>
        <a routerLink="/dashboard/food/create" class="btn-primary">
          + Post Surplus Food
        </a>
      </div>

      <!-- Filters & Search Bar -->
      <div class="zh-card p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col md:flex-row gap-3 items-center">
        <!-- Search Input -->
        <div class="relative flex-1 w-full">
          <svg class="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by food title, donor, or city..."
            class="zh-input pl-10 w-full"
            [(ngModel)]="searchQuery"
            (input)="applyFilters()"
          />
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <select class="zh-input w-full md:w-auto text-xs font-semibold" [(ngModel)]="selectedCategory" (change)="applyFilters()">
            <option value="">All Categories</option>
            <option value="cooked">Cooked Meals</option>
            <option value="raw">Raw Produce</option>
            <option value="packaged">Packaged Items</option>
            <option value="bakery">Bakery & Pastry</option>
            <option value="beverage">Beverage</option>
          </select>

          <select class="zh-input w-full md:w-auto text-xs font-semibold" [(ngModel)]="selectedStatus" (change)="applyFilters()">
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="collected">Collected</option>
          </select>

          <button (click)="resetFilters()" class="btn-secondary">Reset</button>
        </div>
      </div>

      <!-- Cards Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="skeleton h-64 rounded-3xl"></div>
          <div class="skeleton h-64 rounded-3xl"></div>
          <div class="skeleton h-64 rounded-3xl"></div>
        </div>
      } @else if (filteredFood().length === 0) {
        <div class="zh-card p-12 text-center border-[var(--border-color)] space-y-3">
          <span class="text-4xl block">🍱</span>
          <h3 class="font-extrabold text-base text-[var(--text-main)]">No Food Rescue Listings Found</h3>
          <p class="text-xs text-[var(--text-muted)]">Adjust your search query or reset active filters</p>
          <button (click)="resetFilters()" class="btn-secondary">Clear Filters</button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (food of filteredFood(); track food._id) {
            <div
              [routerLink]="['/dashboard/food', food._id]"
              class="zh-card p-0 border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden flex flex-col justify-between hover:border-[var(--primary)]/40 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="badge badge-primary text-[10px] uppercase font-bold">{{ food.category }}</span>
                  <span class="badge badge-{{ food.status === 'available' ? 'success' : 'warning' }} text-[10px] uppercase font-bold">
                    {{ food.status }}
                  </span>
                </div>

                <div class="space-y-1">
                  <h3 class="font-black text-base text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                    {{ food.title }}
                  </h3>
                  <p class="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {{ food.description || 'Verified surplus food donation ready for pickup.' }}
                  </p>
                </div>

                <div class="space-y-2 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <span>📦</span>
                      <strong class="text-[var(--text-main)]">{{ food.quantity }}</strong>
                    </span>
                    <span class="badge badge-success text-[9px]">NGO Eligible</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{{ food.city || 'Mumbai' }} · {{ food.pickupAddress || 'Central Hub' }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span>🏢</span>
                    <span class="font-semibold text-[var(--text-main)]">{{ food.restaurantName || food.donatedBy.fullName }}</span>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 bg-[var(--bg-main)] border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                <div class="flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>⏳</span>
                  <span>Expires {{ food.expiryTime | date:'shortTime' }}</span>
                </div>
                <span class="font-bold text-[var(--primary)] group-hover:translate-x-1 transition-transform">Details →</span>
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
