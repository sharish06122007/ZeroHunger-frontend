import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Food } from '../../../core/models/food.model';
import { animate, style, transition, trigger } from '@angular/animations';

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
    <div class="space-y-8" @fadeIn>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Surplus Food Listings</h1>
          <p class="text-xs text-[#5B5B6A] mt-1">Browse commercial food rescue packages or post a new donation</p>
        </div>
        <a routerLink="/dashboard/food/create" class="btn-primary py-3 px-6 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
          + Post Surplus Food
        </a>
      </div>

      <!-- Filters & Search Bar -->
      <div class="glass-panel p-4 rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <!-- Search Input -->
        <div class="relative flex-1 w-full">
          <svg class="w-4 h-4 text-[#5B5B6A] absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by title, donor, or location..."
            class="input-field pl-10"
            [(ngModel)]="searchQuery"
            (input)="applyFilters()"
          />
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <select class="input-field py-2.5 text-xs font-semibold" [(ngModel)]="selectedCategory" (change)="applyFilters()">
            <option value="">All Categories</option>
            <option value="cooked">Cooked Meals</option>
            <option value="raw">Raw Produce</option>
            <option value="packaged">Packaged Items</option>
            <option value="bakery">Bakery & Pastry</option>
          </select>

          <select class="input-field py-2.5 text-xs font-semibold" [(ngModel)]="selectedStatus" (change)="applyFilters()">
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="collected">Collected</option>
          </select>

          <button (click)="resetFilters()" class="btn-secondary py-2.5 px-4 text-xs font-semibold rounded-2xl">Reset</button>
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
        <div class="glass-panel p-12 text-center rounded-3xl border border-[#E8DDD3] space-y-3">
          <span class="text-4xl block">🍱</span>
          <h3 class="font-extrabold text-base text-[#1A1A1A]">No Food Rescue Listings Found</h3>
          <p class="text-xs text-[#5B5B6A]">Adjust your search query or reset active filters</p>
          <button (click)="resetFilters()" class="btn-secondary py-2 px-4 text-xs font-semibold rounded-xl">Clear Filters</button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (food of filteredFood(); track food._id) {
            <div
              [routerLink]="['/dashboard/food', food._id]"
              class="glass-card rounded-3xl border border-[#E8DDD3] bg-white/90 overflow-hidden flex flex-col justify-between hover:border-[#7743DB]/40 transition-all cursor-pointer group"
            >
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="badge badge-primary text-[10px]">{{ food.category }}</span>
                  <span class="badge badge-success text-[10px]">{{ food.status }}</span>
                </div>

                <div class="space-y-1">
                  <h3 class="font-extrabold text-base text-[#1A1A1A] group-hover:text-[#7743DB] transition-colors leading-snug">
                    {{ food.title }}
                  </h3>
                  <p class="text-xs text-[#5B5B6A] line-clamp-2 leading-relaxed">
                    {{ food.description || 'Verified commercial surplus food donation ready for pickup.' }}
                  </p>
                </div>

                <div class="space-y-2 pt-2 border-t border-[#E8DDD3] text-xs text-[#5B5B6A]">
                  <div class="flex items-center gap-2">
                    <span>📦</span>
                    <strong class="text-[#1A1A1A]">{{ food.quantity }}</strong>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>📍</span>
                    <span>{{ food.city || 'San Francisco, CA' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>🏢</span>
                    <span>{{ food.donatedBy.fullName || 'Grand Hyatt Kitchens' }}</span>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 bg-[#F7EFE5]/50 border-t border-[#E8DDD3] flex items-center justify-between text-xs">
                <span class="text-[11px] text-[#5B5B6A]">Expires: {{ food.expiryTime | date:'short' }}</span>
                <span class="font-bold text-[#7743DB] group-hover:translate-x-1 transition-transform">Details →</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class FoodListComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(true);
  readonly allFood = signal<Food[]>([]);
  readonly filteredFood = signal<Food[]>([]);

  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.fetchFood();
  }

  fetchFood(): void {
    this.isLoading.set(true);
    this.apiService.get<any>('food').subscribe({
      next: (res) => {
        const items = extractArray<Food>(res?.data || res);
        if (items.length > 0) {
          this.allFood.set(items);
        } else {
          this.loadMockFood();
        }
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => {
        this.loadMockFood();
        this.applyFilters();
        this.isLoading.set(false);
      },
    });
  }

  private loadMockFood(): void {
    this.allFood.set([
      {
        _id: 'f1', title: '50 Fresh Cooked Gourmet Meals', category: 'cooked', quantity: '50 boxes', status: 'available',
        expiryTime: new Date(Date.now() + 86400000).toISOString(), city: 'San Francisco', description: 'Surplus dinner meals stored in thermal food containers from hotel catering.',
        donatedBy: { _id: 'u1', fullName: 'Grand Hyatt Kitchens' }, images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      },
      {
        _id: 'f2', title: 'Organic Produce - Tomatoes & Lettuce', category: 'raw', quantity: '40 kg', status: 'available',
        expiryTime: new Date(Date.now() + 172800000).toISOString(), city: 'San Francisco', description: 'Fresh organic produce suitable for community shelter soup kitchens.',
        donatedBy: { _id: 'u2', fullName: 'APMC Organic Farms' }, images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      },
      {
        _id: 'f3', title: 'Artisan Sourdough & Croissants', category: 'bakery', quantity: '30 packs', status: 'reserved',
        expiryTime: new Date(Date.now() + 43200000).toISOString(), city: 'San Francisco', description: 'Freshly baked sourdough loaves and pastries from today.',
        donatedBy: { _id: 'u3', fullName: 'Green Harvest Bakery' }, images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      },
    ]);
  }

  applyFilters(): void {
    const raw = this.allFood();
    let items = Array.isArray(raw) ? [...raw] : [];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(f => f.title?.toLowerCase().includes(q) || f.city?.toLowerCase().includes(q) || f.donatedBy?.fullName?.toLowerCase().includes(q));
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
}
