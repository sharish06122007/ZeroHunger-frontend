import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeFoodService } from '../services/home-food.service';
import { LucideAngularModule } from 'lucide-angular';
import { animate, style, transition, trigger } from '@angular/animations';
import { ZhInputComponent } from '../../../shared/components/ui/zh-input/zh-input.component';
import { ZhSelectComponent } from '../../../shared/components/ui/zh-select/zh-select.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';
import { ZhCardComponent } from '../../../shared/components/ui/zh-card/zh-card.component';

@Component({
  selector: 'app-home-food-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, ZhInputComponent, ZhSelectComponent, ZhButtonComponent, ZhCardComponent],
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="max-w-3xl mx-auto space-y-8">
      
      <!-- Form Header -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary-very-light text-brand-primary mb-4 shadow-sm">
          <lucide-icon name="soup" class="w-8 h-8"></lucide-icon>
        </div>
        <h2 class="text-3xl font-extrabold text-brand-text tracking-tight mb-2">Request Homemade Food</h2>
        <p class="text-brand-muted">Tell us what you're craving, and we'll find a verified home cook for you.</p>
      </div>

      <app-zh-card [noPadding]="true">
        <!-- Progress Indicator -->
        <div class="p-6 border-b border-brand-border bg-brand-bg rounded-t-2xl">
          <div class="flex items-center justify-between relative">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-brand-border -z-10 rounded-full">
               <div class="h-full bg-brand-primary transition-all duration-300" [style.width.%]="((currentStep() - 1) / 3) * 100"></div>
            </div>
            
            @for (step of steps; track step.id; let i = $index) {
              <div class="flex flex-col items-center gap-2 bg-brand-bg px-2">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2"
                  [ngClass]="{
                    'bg-brand-primary border-brand-primary text-white shadow-md': currentStep() >= step.id,
                    'bg-white border-brand-border text-brand-muted': currentStep() < step.id
                  }"
                >
                  <lucide-icon *ngIf="currentStep() > step.id" name="check" class="w-5 h-5"></lucide-icon>
                  <span *ngIf="currentStep() <= step.id">{{ step.id }}</span>
                </div>
                <span class="text-xs font-semibold hidden sm:block" [ngClass]="currentStep() >= step.id ? 'text-brand-text' : 'text-brand-muted'">{{ step.title }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-8">
          
          <div *ngIf="successMessage" class="mb-6 p-4 rounded-xl bg-brand-primary-very-light border border-brand-primary-light flex gap-3 text-brand-primary-dark">
            <lucide-icon name="check-circle" class="w-5 h-5 shrink-0"></lucide-icon>
            <div>
              <p class="font-bold">Request Broadcasted Successfully!</p>
              <p class="text-sm mt-1">Verified food makers nearby have been notified. We will let you know once someone accepts.</p>
            </div>
          </div>

          <form [formGroup]="requestForm" (ngSubmit)="onSubmit()">
            
            <!-- Step 1: What Food -->
            <div *ngIf="currentStep() === 1" @stepAnimation class="space-y-6">
              <h3 class="text-xl font-bold text-brand-text mb-4">What are you craving?</h3>
              
              <app-zh-select
                formControlName="foodCategory"
                label="Food Category"
                [options]="categories"
                [error]="isInvalid('foodCategory') ? 'Category is required' : ''"
              ></app-zh-select>

              <app-zh-input
                formControlName="foodItemName"
                label="Food Item Name"
                placeholder="e.g. 5 Roti and Paneer Curry"
                icon="utensils"
                [error]="isInvalid('foodItemName') ? 'Food name is required' : ''"
              ></app-zh-input>
            </div>

            <!-- Step 2: How Much -->
            <div *ngIf="currentStep() === 2" @stepAnimation class="space-y-6">
              <h3 class="text-xl font-bold text-brand-text mb-4">How much do you need?</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <app-zh-input
                  formControlName="numberOfPeople"
                  type="number"
                  label="Number of People"
                  icon="users"
                  [error]="isInvalid('numberOfPeople') ? 'Invalid number' : ''"
                ></app-zh-input>
                
                <app-zh-input
                  formControlName="quantityRequired"
                  type="number"
                  label="Quantity (Portions)"
                  icon="pie-chart"
                  [error]="isInvalid('quantityRequired') ? 'Invalid quantity' : ''"
                ></app-zh-input>
              </div>

              <app-zh-input
                formControlName="budgetRange"
                label="Expected Budget (₹)"
                placeholder="e.g. 200 - 300"
                icon="banknote"
                [error]="isInvalid('budgetRange') ? 'Budget is required' : ''"
              ></app-zh-input>
            </div>

            <!-- Step 3: Where & When -->
            <div *ngIf="currentStep() === 3" @stepAnimation class="space-y-6">
              <h3 class="text-xl font-bold text-brand-text mb-4">Where and When?</h3>
              
              <app-zh-input
                formControlName="deliveryAddress"
                label="Delivery Address"
                placeholder="Enter complete address"
                icon="map-pin"
                [error]="isInvalid('deliveryAddress') ? 'Address is required' : ''"
              ></app-zh-input>

              <app-zh-input
                formControlName="requiredDeliveryTime"
                type="datetime-local"
                label="Required Delivery Time"
                icon="clock"
                [error]="isInvalid('requiredDeliveryTime') ? 'Time is required' : ''"
              ></app-zh-input>

              <div class="mb-4">
                <label class="block text-sm font-medium text-brand-text mb-1">Special Instructions</label>
                <textarea 
                  formControlName="specialInstructions" 
                  rows="3" 
                  placeholder="e.g. Less spicy, Jain food..."
                  class="w-full bg-brand-bg border border-brand-border text-brand-text text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary block p-3 transition-colors duration-200"
                ></textarea>
              </div>
            </div>

            <!-- Step 4: Confirm -->
            <div *ngIf="currentStep() === 4" @stepAnimation class="space-y-6">
              <h3 class="text-xl font-bold text-brand-text mb-4">Review & Confirm</h3>
              
              <div class="bg-brand-bg rounded-2xl p-5 border border-brand-border space-y-4">
                <div class="flex justify-between items-center pb-4 border-b border-brand-border">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-brand-primary-very-light text-brand-primary rounded-xl flex items-center justify-center">
                      <lucide-icon name="utensils-crossed" class="w-6 h-6"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-bold text-brand-text text-lg">{{ requestForm.value.foodItemName }}</p>
                      <p class="text-sm text-brand-muted">{{ requestForm.value.foodCategory }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-brand-primary text-lg">₹{{ requestForm.value.budgetRange }}</p>
                    <p class="text-xs text-brand-muted">Expected</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-brand-muted mb-1">Portions / People</p>
                    <p class="font-semibold text-brand-text">{{ requestForm.value.quantityRequired }} / {{ requestForm.value.numberOfPeople }}</p>
                  </div>
                  <div>
                    <p class="text-brand-muted mb-1">Delivery Time</p>
                    <p class="font-semibold text-brand-text">{{ formatTime(requestForm.value.requiredDeliveryTime) }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-brand-muted mb-1">Address</p>
                    <p class="font-semibold text-brand-text">{{ requestForm.value.deliveryAddress }}</p>
                  </div>
                  <div class="col-span-2" *ngIf="requestForm.value.specialInstructions">
                    <p class="text-brand-muted mb-1">Instructions</p>
                    <p class="font-semibold text-brand-text bg-white p-2 rounded-lg border border-brand-border italic">{{ requestForm.value.specialInstructions }}</p>
                  </div>
                </div>
              </div>

              <!-- Smart Pricing UI Breakdown -->
              <div class="bg-white rounded-2xl p-5 border border-brand-border space-y-3 shadow-sm">
                <h4 class="font-bold text-sm text-brand-text mb-2">Estimated Cost Breakdown</h4>
                <div class="flex justify-between text-sm">
                  <span class="text-brand-muted">Food Cost (Est.)</span>
                  <span class="font-medium text-brand-text">₹{{ parseBudget(requestForm.value.budgetRange) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-brand-muted">Delivery Fee (Est.)</span>
                  <span class="font-medium text-brand-text">₹40</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-brand-muted">Platform Fee</span>
                  <span class="font-medium text-brand-text">₹10</span>
                </div>
                <div class="pt-3 border-t border-brand-border flex justify-between items-center">
                  <span class="font-bold text-brand-text">Total Estimated</span>
                  <span class="font-extrabold text-brand-primary text-lg">₹{{ parseBudget(requestForm.value.budgetRange) + 50 }}</span>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-8 pt-6 border-t border-brand-border">
              <app-zh-button *ngIf="currentStep() > 1" variant="ghost" (onClick)="prevStep()" [disabled]="isSubmitting">
                Back
              </app-zh-button>
              <div *ngIf="currentStep() === 1"></div> <!-- Spacer -->

              <app-zh-button *ngIf="currentStep() < 4" variant="primary" (onClick)="nextStep()">
                Continue
              </app-zh-button>

              <app-zh-button *ngIf="currentStep() === 4" variant="primary" type="submit" [loading]="isSubmitting">
                Confirm & Request
              </app-zh-button>
            </div>

          </form>
        </div>
      </app-zh-card>
    </div>
  `
})
export class HomeFoodRequestFormComponent implements OnInit {
  requestForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  
  readonly currentStep = signal(1);

  steps = [
    { id: 1, title: 'What' },
    { id: 2, title: 'How Much' },
    { id: 3, title: 'Where & When' },
    { id: 4, title: 'Confirm' }
  ];

  categories = [
    { label: 'Breakfast', value: 'Breakfast', icon: 'coffee' },
    { label: 'Lunch', value: 'Lunch', icon: 'sun' },
    { label: 'Dinner', value: 'Dinner', icon: 'moon' },
    { label: 'Snacks', value: 'Snacks', icon: 'cookie' },
    { label: 'Traditional Foods', value: 'Traditional', icon: 'flame' }
  ];

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

  isInvalid(field: string): boolean {
    const ctrl = this.requestForm.get(field);
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }

  validateStep(step: number): boolean {
    const fieldsByStep: Record<number, string[]> = {
      1: ['foodCategory', 'foodItemName'],
      2: ['numberOfPeople', 'quantityRequired', 'budgetRange'],
      3: ['deliveryAddress', 'requiredDeliveryTime']
    };

    const fields = fieldsByStep[step];
    if (!fields) return true;

    let isValid = true;
    fields.forEach(field => {
      const ctrl = this.requestForm.get(field);
      ctrl?.markAsTouched();
      if (ctrl?.invalid) {
        isValid = false;
      }
    });

    return isValid;
  }

  nextStep() {
    if (this.validateStep(this.currentStep())) {
      this.currentStep.update(v => v + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(v => v - 1);
      this.successMessage = '';
    }
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  parseBudget(budget: string): number {
    if (!budget) return 0;
    // Extract first number found for estimation
    const match = budget.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    
    this.homeFoodService.createRequest(this.requestForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Your food request has been broadcasted to nearby makers!';
        setTimeout(() => {
          this.requestForm.reset({ numberOfPeople: 1, quantityRequired: 1 });
          this.currentStep.set(1);
          this.successMessage = '';
        }, 4000);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert("Failed to submit request: " + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }
}
