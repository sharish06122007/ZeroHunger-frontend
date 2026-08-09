import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-food-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="max-w-3xl mx-auto space-y-8" @fadeIn>
      <div class="space-y-2">
        <a routerLink="/dashboard/food" class="text-xs font-bold text-[#7743DB] hover:underline flex items-center gap-1">
          ← Back to Food Listings
        </a>
        <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Post Surplus Food Donation</h1>
        <p class="text-xs text-[#5B5B6A]">List your surplus meals or ingredients for rapid dispatch to local NGOs</p>
      </div>

      <div class="glass-panel p-8 sm:p-10 rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-xl">
        <form [formGroup]="foodForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="form-group">
            <label class="form-label" for="title">Listing Title <span class="text-rose-500">*</span></label>
            <input id="title" type="text" class="input-field" formControlName="title" placeholder="e.g. 50 Fresh Prepared Gourmet Dinner Boxes" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label" for="category">Category <span class="text-rose-500">*</span></label>
              <select id="category" class="input-field" formControlName="category">
                <option value="cooked">Cooked Meals</option>
                <option value="raw">Raw Produce</option>
                <option value="packaged">Packaged Items</option>
                <option value="bakery">Bakery & Pastry</option>
                <option value="beverage">Beverages</option>
                <option value="dairy">Dairy Products</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="quantity">Quantity / Unit <span class="text-rose-500">*</span></label>
              <input id="quantity" type="text" class="input-field" formControlName="quantity" placeholder="e.g. 50 boxes or 30 kg" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label" for="expiry">Expiration Date & Time <span class="text-rose-500">*</span></label>
              <input id="expiry" type="datetime-local" class="input-field" formControlName="expiryTime" />
            </div>

            <div class="form-group">
              <label class="form-label" for="pickup">Preferred Pickup Window</label>
              <input id="pickup" type="text" class="input-field" formControlName="pickupTime" placeholder="e.g. Today between 5 PM - 8 PM" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label" for="city">City / Metro Area <span class="text-rose-500">*</span></label>
              <input id="city" type="text" class="input-field" formControlName="city" placeholder="San Francisco" />
            </div>

            <div class="form-group">
              <label class="form-label" for="address">Pickup Address / Loading Dock</label>
              <input id="address" type="text" class="input-field" formControlName="pickupAddress" placeholder="123 Market St, Dock 4" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="desc">Food Description & Safety Notes</label>
            <textarea id="desc" rows="3" class="input-field resize-none" formControlName="description" placeholder="Dietary info, storage instructions, hot/cold requirements..."></textarea>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[#E8DDD3]">
            <a routerLink="/dashboard/food" class="btn-secondary py-3 px-6 text-xs font-semibold rounded-2xl">
              Cancel
            </a>
            <button type="submit" [disabled]="isLoading()" class="btn-primary py-3 px-8 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
              @if (isLoading()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Publishing Listing...</span>
              } @else {
                <span>Publish Surplus Food 🚀</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class FoodCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);

  readonly foodForm = this.fb.group({
    title: ['', Validators.required],
    category: ['cooked', Validators.required],
    quantity: ['', Validators.required],
    expiryTime: ['', Validators.required],
    pickupTime: [''],
    city: ['San Francisco', Validators.required],
    pickupAddress: [''],
    description: [''],
    imageUrl: [''],
  });

  onSubmit(): void {
    if (this.foodForm.invalid) {
      this.foodForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const val = this.foodForm.value;

    let isoExpiry = new Date().toISOString();
    try {
      if (val.expiryTime) {
        isoExpiry = new Date(val.expiryTime).toISOString();
      }
    } catch {
      isoExpiry = new Date(Date.now() + 86400000).toISOString();
    }

    const payload = {
      title: val.title!,
      category: val.category!,
      quantity: val.quantity!,
      expiryTime: isoExpiry,
      pickupTime: val.pickupTime || undefined,
      city: val.city!,
      pickupAddress: val.pickupAddress || undefined,
      description: val.description || undefined,
      images: val.imageUrl ? [val.imageUrl] : [],
    };

    this.apiService.post('food', payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Listing Created!', 'Your food donation is now live for claim.');
        this.router.navigate(['/dashboard/food']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Creation Failed', err.message || 'Please check your inputs.');
      },
    });
  }
}
