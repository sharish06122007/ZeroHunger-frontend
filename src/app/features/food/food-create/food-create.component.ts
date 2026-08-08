import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { LucideAngularModule } from 'lucide-angular';
import { ZhInputComponent } from '../../../shared/components/ui/zh-input/zh-input.component';
import { ZhSelectComponent } from '../../../shared/components/ui/zh-select/zh-select.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';
import { ZhCardComponent } from '../../../shared/components/ui/zh-card/zh-card.component';

@Component({
  selector: 'app-food-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, ZhInputComponent, ZhSelectComponent, ZhButtonComponent, ZhCardComponent],
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
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary-very-light text-brand-primary mb-4 shadow-sm">
          <lucide-icon name="heart-handshake" class="w-8 h-8"></lucide-icon>
        </div>
        <h1 class="text-3xl font-extrabold text-brand-text tracking-tight">Post Surplus Food Donation</h1>
        <p class="text-sm text-brand-muted">List your surplus meals or ingredients for rapid dispatch to local NGOs</p>
      </div>

      <app-zh-card [noPadding]="true">
        <div class="p-6 border-b border-brand-border bg-brand-bg rounded-t-2xl flex items-center justify-between">
           <div class="flex items-center gap-3">
              <lucide-icon name="list-plus" class="w-5 h-5 text-brand-primary"></lucide-icon>
              <h3 class="font-bold text-brand-text">Listing Details</h3>
           </div>
           <a routerLink="/dashboard/food" class="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
             <lucide-icon name="arrow-left" class="w-3 h-3"></lucide-icon> Back to Listings
           </a>
        </div>
        
        <form [formGroup]="foodForm" (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          
          <app-zh-input
             formControlName="title"
             label="Listing Title"
             placeholder="e.g. 50 Fresh Prepared Gourmet Dinner Boxes"
             icon="tag"
             [error]="isInvalid('title') ? 'Title is required' : ''"
          ></app-zh-input>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <app-zh-select
                formControlName="category"
                label="Category"
                [options]="categories"
                [error]="isInvalid('category') ? 'Category is required' : ''"
             ></app-zh-select>

             <app-zh-input
                formControlName="quantity"
                label="Quantity / Unit"
                placeholder="e.g. 50 boxes or 30 kg"
                icon="box"
                [error]="isInvalid('quantity') ? 'Quantity is required' : ''"
             ></app-zh-input>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <app-zh-input
                formControlName="expiryTime"
                type="datetime-local"
                label="Expiration Date & Time"
                icon="clock"
                [error]="isInvalid('expiryTime') ? 'Expiration time is required' : ''"
             ></app-zh-input>

             <app-zh-input
                formControlName="pickupTime"
                label="Preferred Pickup Window"
                placeholder="e.g. Today between 5 PM - 8 PM"
                icon="calendar-clock"
             ></app-zh-input>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <app-zh-input
                formControlName="city"
                label="City / Metro Area"
                placeholder="San Francisco"
                icon="map"
                [error]="isInvalid('city') ? 'City is required' : ''"
             ></app-zh-input>

             <app-zh-input
                formControlName="pickupAddress"
                label="Pickup Address / Loading Dock"
                placeholder="123 Market St, Dock 4"
                icon="map-pin"
             ></app-zh-input>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-brand-text mb-1">Food Description & Safety Notes</label>
            <textarea 
               formControlName="description" 
               rows="3" 
               class="w-full bg-brand-bg border border-brand-border text-brand-text text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary block p-3 transition-colors duration-200 resize-none" 
               placeholder="Dietary info, storage instructions, hot/cold requirements..."></textarea>
          </div>

          <div class="flex items-center justify-between pt-6 mt-6 border-t border-brand-border">
            <app-zh-button variant="ghost" routerLink="/dashboard/food">Cancel</app-zh-button>
            <app-zh-button type="submit" variant="primary" [loading]="isLoading()">Publish Surplus Food</app-zh-button>
          </div>
        </form>
      </app-zh-card>
    </div>
  `,
})
export class FoodCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);

  categories = [
     { label: 'Cooked Meals', value: 'cooked', icon: 'utensils' },
     { label: 'Raw Produce', value: 'raw', icon: 'leaf' },
     { label: 'Packaged Items', value: 'packaged', icon: 'package' },
     { label: 'Bakery & Pastry', value: 'bakery', icon: 'croissant' },
     { label: 'Beverages', value: 'beverage', icon: 'cup-soda' },
     { label: 'Dairy Products', value: 'dairy', icon: 'milk' },
  ];

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

  ngOnInit() {
     // Format current time + 24 hours for default expiry time
     const tomorrow = new Date();
     tomorrow.setDate(tomorrow.getDate() + 1);
     const formattedDate = tomorrow.toISOString().slice(0, 16);
     this.foodForm.patchValue({ expiryTime: formattedDate });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.foodForm.get(field);
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }

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
