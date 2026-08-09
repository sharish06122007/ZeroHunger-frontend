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
        <a routerLink="/dashboard/food" class="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Food Listings
        </a>
        <h1 class="text-4xl font-black text-brand-text tracking-tighter">Post Surplus Food Donation</h1>
        <p class="text-sm text-brand-textSec">List your surplus meals or ingredients for rapid dispatch to local NGOs</p>
      </div>

      <!-- Multi-step Wizard Progress -->
      <div class="flex items-center justify-between mb-8 relative">
        <!-- Progress Line Background -->
        <div class="absolute top-1/2 left-0 right-0 h-1 bg-brand-borderLight -z-0 mx-8 -translate-y-1/2 hidden sm:block">
          <div class="h-full bg-brand-primary transition-all duration-300 ease-out" [style.width]="((step() - 1) / 3) * 100 + '%'"></div>
        </div>
        
        @for (s of [1, 2, 3, 4]; track s) {
          <div class="flex flex-col items-center gap-2 relative z-10 w-1/4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300"
                 [ngClass]="step() >= s ? 'bg-brand-primary text-white shadow-premium' : 'bg-brand-borderLight text-brand-textSec bg-white'">
              {{ s }}
            </div>
            <span class="text-[10px] uppercase tracking-wider font-semibold hidden sm:block"
                  [ngClass]="step() >= s ? 'text-brand-primary' : 'text-brand-textSec'">
              {{ s === 1 ? 'Details' : s === 2 ? 'Quantity' : s === 3 ? 'Location' : 'Confirm' }}
            </span>
          </div>
        }
      </div>

      <div class="zh-card p-8 sm:p-12">
        <form [formGroup]="foodForm" (ngSubmit)="onSubmit()" class="space-y-8">
          
          <!-- STEP 1: Details -->
          @if (step() === 1) {
            <div class="space-y-6 animate-fade-in-up">
              <h2 class="text-2xl font-bold text-brand-text mb-6">What are you donating?</h2>
              
              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2" for="title">Listing Title <span class="text-brand-danger">*</span></label>
                <input id="title" type="text" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" formControlName="title" placeholder="e.g. 50 Fresh Prepared Gourmet Dinner Boxes" />
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2" for="category">Category <span class="text-brand-danger">*</span></label>
                <select id="category" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" formControlName="category">
                  <option value="cooked">Cooked Meals</option>
                  <option value="raw">Raw Produce</option>
                  <option value="packaged">Packaged Items</option>
                  <option value="bakery">Bakery & Pastry</option>
                  <option value="beverage">Beverages</option>
                  <option value="dairy">Dairy Products</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2" for="desc">Food Description & Safety Notes</label>
                <textarea id="desc" rows="3" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm resize-none focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" formControlName="description" placeholder="Dietary info, storage instructions, hot/cold requirements..."></textarea>
              </div>
            </div>
          }

          <!-- STEP 2: Quantity & Timing -->
          @if (step() === 2) {
            <div class="space-y-6 animate-fade-in-up">
              <h2 class="text-2xl font-bold text-brand-text mb-6">Quantity and Timing</h2>
              
              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2" for="quantity">Quantity / Unit <span class="text-brand-danger">*</span></label>
                <input id="quantity" type="text" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary" formControlName="quantity" placeholder="e.g. 50 boxes or 30 kg" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="block text-sm font-semibold text-brand-text mb-2" for="expiry">Expiration Date & Time <span class="text-brand-danger">*</span></label>
                  <input id="expiry" type="datetime-local" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary" formControlName="expiryTime" />
                </div>
                <div class="form-group">
                  <label class="block text-sm font-semibold text-brand-text mb-2" for="pickup">Preferred Pickup Window</label>
                  <input id="pickup" type="text" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary" formControlName="pickupTime" placeholder="e.g. Today between 5 PM - 8 PM" />
                </div>
              </div>
            </div>
          }

          <!-- STEP 3: Location -->
          @if (step() === 3) {
            <div class="space-y-6 animate-fade-in-up">
              <h2 class="text-2xl font-bold text-brand-text mb-6">Where should we pick it up?</h2>
              
              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2" for="city">City / Metro Area <span class="text-brand-danger">*</span></label>
                <input id="city" type="text" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary" formControlName="city" placeholder="e.g. Mumbai" />
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2" for="address">Pickup Address / Loading Dock</label>
                <input id="address" type="text" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary" formControlName="pickupAddress" placeholder="123 Market St, Dock 4" />
              </div>
            </div>
          }

          <!-- STEP 4: Confirmation -->
          @if (step() === 4) {
            <div class="space-y-6 animate-fade-in-up text-center">
              <div class="w-24 h-24 mx-auto bg-brand-success/10 rounded-full flex items-center justify-center text-brand-success mb-6">
                <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h2 class="text-2xl font-bold text-brand-text mb-2">Ready to Publish?</h2>
              <p class="text-sm text-brand-textSec max-w-md mx-auto">Your donation of <strong class="text-brand-text">{{ foodForm.value.quantity }}</strong> will be immediately available to NGOs and Volunteers in <strong class="text-brand-text">{{ foodForm.value.city }}</strong>.</p>
              
              <div class="bg-brand-bgWarm p-6 rounded-2xl border border-brand-borderLight text-left mt-8">
                <p class="text-xs text-brand-textSec mb-2 uppercase font-bold tracking-wider">Summary</p>
                <h4 class="font-bold text-brand-text text-lg mb-1">{{ foodForm.value.title }}</h4>
                <p class="text-sm text-brand-textSec">Expires at: {{ foodForm.value.expiryTime | date:'medium' }}</p>
              </div>
            </div>
          }

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between pt-8 border-t border-brand-borderLight mt-8">
            @if (step() > 1) {
              <button type="button" (click)="prevStep()" class="btn-secondary h-12">
                ← Back
              </button>
            } @else {
              <div></div>
            }
            
            @if (step() < 4) {
              <button type="button" (click)="nextStep()" class="btn-primary h-12">
                Next Step →
              </button>
            } @else {
              <button type="submit" [disabled]="isLoading()" class="btn-primary h-12 px-8">
                @if (isLoading()) {
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Publishing...
                } @else {
                  Publish Surplus Food 🚀
                }
              </button>
            }
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
  readonly step = signal(1);

  readonly foodForm = this.fb.group({
    title: ['', Validators.required],
    category: ['cooked', Validators.required],
    quantity: ['', Validators.required],
    expiryTime: ['', Validators.required],
    pickupTime: [''],
    city: ['', Validators.required],
    pickupAddress: [''],
    description: [''],
    imageUrl: [''],
  });

  nextStep(): void {
    if (this.step() < 4) {
      this.step.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.step() > 1) {
      this.step.update(s => s - 1);
    }
  }

  onSubmit(): void {
    if (this.foodForm.invalid) {
      this.toast.error('Form Incomplete', 'Please fill in all required fields.');
      this.step.set(1);
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
