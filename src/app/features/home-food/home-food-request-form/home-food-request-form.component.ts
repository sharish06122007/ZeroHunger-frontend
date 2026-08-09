import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeFoodService } from '../services/home-food.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home-food-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 pb-12" @fadeIn>
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-brand-text tracking-tighter">Request Home Food</h1>
        <p class="text-sm text-brand-textSec">Get affordable, healthy homemade meals delivered from verified local makers.</p>
      </div>

      <div class="zh-card p-8 sm:p-12">
        <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-10">
          
          <!-- SECTION 1: Food Details -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b border-brand-borderLight pb-3">
              <span class="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">1</span>
              <h3 class="text-xl font-bold text-brand-text">What are you craving?</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Food Category</label>
                <select formControlName="foodCategory" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary transition-all">
                  <option value="">Select Category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Traditional">Traditional Foods</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Food Item Name</label>
                <input type="text" formControlName="foodItemName" placeholder="e.g. 5 Roti and Paneer Curry" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary transition-all">
              </div>
            </div>

            <!-- New Preferences -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Dietary Preference</label>
                <select formControlName="foodPreference" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary transition-all">
                  <option value="Any">Any</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Spice Level</label>
                <select formControlName="spicePreference" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary transition-all">
                  <option value="Medium">Medium</option>
                  <option value="Mild">Mild</option>
                  <option value="Spicy">Spicy</option>
                  <option value="Extra Spicy">Extra Spicy</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Allergies / Notes</label>
                <input type="text" formControlName="allergies" placeholder="e.g. No nuts" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary transition-all">
              </div>
            </div>
          </div>

          <!-- SECTION 2: Quantity & Budget -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b border-brand-borderLight pb-3">
              <span class="w-8 h-8 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold text-sm">2</span>
              <h3 class="text-xl font-bold text-brand-text">Quantity & Budget</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Number of People</label>
                <input type="number" formControlName="numberOfPeople" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-emerald transition-all">
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Total Quantity</label>
                <input type="number" formControlName="quantityRequired" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-emerald transition-all">
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Budget Range (₹)</label>
                <input type="text" formControlName="budgetRange" placeholder="e.g. ₹200 - ₹300" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-emerald transition-all">
              </div>
            </div>
          </div>

          <!-- SECTION 3: Delivery -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b border-brand-borderLight pb-3">
              <span class="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-sm">3</span>
              <h3 class="text-xl font-bold text-brand-text">Delivery Details</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group sm:col-span-2">
                <label class="block text-sm font-semibold text-brand-text mb-2">Delivery Address</label>
                <textarea formControlName="deliveryAddress" rows="2" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-indigo transition-all resize-none"></textarea>
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Required Delivery Time</label>
                <input type="datetime-local" formControlName="requiredDeliveryTime" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-indigo transition-all">
              </div>

              <div class="form-group">
                <label class="block text-sm font-semibold text-brand-text mb-2">Max Distance (km)</label>
                <select formControlName="deliveryDistance" class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-indigo transition-all">
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="20">Within 20 km</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="block text-sm font-semibold text-brand-text mb-2">Special Instructions</label>
              <textarea formControlName="specialInstructions" rows="2" placeholder="e.g. Call upon arrival..." class="w-full bg-brand-bgWarm border border-brand-borderLight rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-indigo transition-all resize-none"></textarea>
            </div>
          </div>

          <div class="pt-8 border-t border-brand-borderLight flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="w-full sm:w-auto">
              @if (successMessage) {
                <div class="animate-fade-in-up flex items-center gap-2 text-brand-success font-bold text-sm bg-brand-success/10 px-4 py-2 rounded-xl">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ successMessage }}
                </div>
              }
            </div>
            <button type="submit" [disabled]="isSubmitting" class="w-full sm:w-auto btn-primary px-8 h-12 shadow-premium-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              @if (isSubmitting) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Submitting Request...
              } @else {
                Broadcast Request 🍲
              }
            </button>
          </div>
        </form>
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
      foodPreference: ['Any'],
      spicePreference: ['Medium'],
      allergies: [''],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]],
      quantityRequired: [1, [Validators.required, Validators.min(1)]],
      budgetRange: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      requiredDeliveryTime: ['', Validators.required],
      deliveryDistance: ['5'],
      specialInstructions: ['']
    });
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      alert("Please fill in all required fields correctly.");
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    
    // Maintain existing service call contract. We can just send the new fields, the backend might ignore them if not mapped, but frontend form works.
    this.homeFoodService.createRequest(this.requestForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Your food request has been broadcasted to nearby makers!';
        this.requestForm.reset({ numberOfPeople: 1, quantityRequired: 1, foodPreference: 'Any', spicePreference: 'Medium', deliveryDistance: '5' });
        
        setTimeout(() => this.successMessage = '', 6000);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert("Failed to submit request: " + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }
}
