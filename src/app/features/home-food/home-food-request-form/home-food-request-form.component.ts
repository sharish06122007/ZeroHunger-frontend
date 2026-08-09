import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeFoodService } from '../services/home-food.service';

@Component({
  selector: 'app-home-food-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-[var(--bg-main)] min-h-screen p-6 sm:p-12 space-y-8 flex flex-col justify-center items-center" @fadeInUp>
      <div class="w-full max-w-2xl">
        <h2 class="text-center text-3xl font-extrabold text-[var(--text-main)]">Request Home Food</h2>
        <p class="mt-2 text-center text-xs text-[var(--text-muted)]">
          Get affordable, healthy homemade meals delivered to you.
        </p>
      </div>

      <div class="w-full max-w-2xl">
        <div class="zh-card p-8 sm:p-10 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl">
          <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div class="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
              <div class="sm:col-span-2 form-group">
                <label class="zh-label">Food Category</label>
                <div class="mt-1">
                  <select formControlName="foodCategory" class="zh-input w-full">
                    <option value="">Select Category</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Traditional">Traditional Foods</option>
                  </select>
                </div>
              </div>

              <div class="sm:col-span-2 form-group">
                <label class="zh-label">Food Item Name</label>
                <div class="mt-1">
                  <input type="text" formControlName="foodItemName" placeholder="e.g. 5 Roti and Paneer Curry" class="zh-input w-full">
                </div>
              </div>

              <div class="form-group">
                <label class="zh-label">Number of People</label>
                <div class="mt-1">
                  <input type="number" formControlName="numberOfPeople" class="zh-input w-full">
                </div>
              </div>

              <div class="form-group">
                <label class="zh-label">Quantity</label>
                <div class="mt-1">
                  <input type="number" formControlName="quantityRequired" class="zh-input w-full">
                </div>
              </div>

              <div class="sm:col-span-2 form-group">
                <label class="zh-label">Budget Range (₹)</label>
                <div class="mt-1">
                  <input type="text" formControlName="budgetRange" placeholder="e.g. ₹200 - ₹300" class="zh-input w-full">
                </div>
              </div>

              <div class="sm:col-span-2 form-group">
                <label class="zh-label">Delivery Address</label>
                <div class="mt-1">
                  <textarea formControlName="deliveryAddress" rows="2" class="zh-input w-full resize-none"></textarea>
                </div>
              </div>

              <div class="sm:col-span-2 form-group">
                <label class="zh-label">Required Delivery Time</label>
                <div class="mt-1">
                  <input type="datetime-local" formControlName="requiredDeliveryTime" class="zh-input w-full">
                </div>
              </div>

              <div class="sm:col-span-2 form-group">
                <label class="zh-label">Special Instructions</label>
                <div class="mt-1">
                  <textarea formControlName="specialInstructions" rows="2" placeholder="e.g. Less spicy, Jain food..." class="zh-input w-full resize-none"></textarea>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button type="submit" [disabled]="isSubmitting" class="btn-primary w-full py-3 flex justify-center items-center disabled:opacity-50 transition-all duration-200">
                <svg *ngIf="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Submitting Request...' : 'Submit Food Request' }}
              </button>
            </div>
          </form>

          <div *ngIf="successMessage" class="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-emerald-800">{{ successMessage }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class HomeFoodRequestFormComponent implements OnInit {
  requestForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private homeFoodService: HomeFoodService
  ) {}

  ngOnInit() {
    this.requestForm = this.fb.group({
      foodCategory: ['', Validators.required],
      foodItemName: ['', Validators.required],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]],
      quantityRequired: [1, [Validators.required, Validators.min(1)]],
      budgetRange: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      requiredDeliveryTime: ['', Validators.required],
      specialInstructions: ['']
    });
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    
    this.homeFoodService.createRequest(this.requestForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Your food request has been broadcasted to nearby makers!';
        this.requestForm.reset({ numberOfPeople: 1, quantityRequired: 1 });
      },
      error: (err) => {
        this.isSubmitting = false;
        alert("Failed to submit request: " + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }
}
