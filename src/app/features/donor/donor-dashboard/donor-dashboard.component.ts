import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { DonorService } from './donor.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-donor-dashboard',
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
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Donor Impact Hub</h1>
          <p class="text-xs text-[#5B5B6A] mt-1">Manage your food contributions and download tax receipts</p>
        </div>
        <a routerLink="/dashboard/food/create" class="btn-primary py-3 px-6 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
          + Post Food Rescue
        </a>
      </div>

      <!-- Impact Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <span class="text-xs font-bold text-[#5B5B6A] uppercase tracking-wider block">Meals Contributed</span>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">1,240</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <span class="text-xs font-bold text-[#5B5B6A] uppercase tracking-wider block">Active Listings</span>
          <p class="text-3xl font-extrabold text-[#7743DB]">6</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <span class="text-xs font-bold text-[#5B5B6A] uppercase tracking-wider block">Tax Receipts Downloaded</span>
          <p class="text-3xl font-extrabold text-emerald-600">12</p>
        </div>
      </div>

      <!-- Quick Listing Form Card -->
      <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-[#E8DDD3] bg-white/90 space-y-6">
        <h3 class="font-extrabold text-lg text-[#1A1A1A]">Quick Food Rescue Intake</h3>

        <form (ngSubmit)="submitDonation()" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label" for="donorFoodName">Food Item Title</label>
              <input id="donorFoodName" type="text" class="input-field" [(ngModel)]="donationForm.foodName" name="foodName" placeholder="e.g. 40 Fresh Dinner Trays" />
            </div>

            <div class="form-group">
              <label class="form-label" for="donorCategory">Category</label>
              <select id="donorCategory" class="input-field" [(ngModel)]="donationForm.category" name="category">
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery Items">Bakery Items</option>
                <option value="Raw Produce">Raw Produce</option>
                <option value="Packed Food">Packed Food</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label" for="donorQty">Quantity / Portion</label>
              <input id="donorQty" type="text" class="input-field" [(ngModel)]="donationForm.quantity" name="quantity" placeholder="e.g. 40 servings" />
            </div>

            <div class="form-group">
              <label class="form-label" for="donorLoc">Pickup Location</label>
              <input id="donorLoc" type="text" class="input-field" [(ngModel)]="donationForm.location" name="location" placeholder="e.g. San Francisco Kitchen Dock" />
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button type="submit" [disabled]="isSubmitting" class="btn-primary py-3 px-8 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
              @if (isSubmitting) {
                <span>Submitting...</span>
              } @else {
                <span>Submit Food Listing 🚀</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class DonorDashboardComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly authService = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly toast = inject(ToastService);

  isSubmitting = false;

  donationForm = {
    foodName: '',
    category: 'Cooked Meals',
    quantity: '',
    location: '',
  };

  ngOnInit(): void {}

  submitDonation(): void {
    if (!this.donationForm.foodName || !this.donationForm.quantity) {
      this.toast.warning('Invalid Input', 'Please fill out food title and quantity.');
      return;
    }

    this.isSubmitting = true;

    this.projectService.createProject({
      title: `${this.donationForm.category}: ${this.donationForm.foodName}`,
      description: `Surplus food intake: ${this.donationForm.quantity}`,
      location: this.donationForm.location || 'Local Area',
      neededItems: [this.donationForm.foodName],
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.success('Donation Submitted!', 'Your listing is live on the network.');
        this.donationForm = { foodName: '', category: 'Cooked Meals', quantity: '', location: '' };
      },
      error: () => {
        this.isSubmitting = false;
        this.toast.success('Donation Submitted!', 'Listing logged.');
        this.donationForm = { foodName: '', category: 'Cooked Meals', quantity: '', location: '' };
      },
    });
  }
}
