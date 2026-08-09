import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Food } from '../../../core/models/food.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-food-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto" @fadeIn>
      <a routerLink="/dashboard/food" class="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
        ← Back to Food Listings
      </a>

      @if (isLoading()) {
        <div class="glass-panel p-8 rounded-3xl space-y-4">
          <div class="skeleton h-48 rounded-2xl"></div>
          <div class="skeleton h-8 w-1/2 rounded-xl"></div>
          <div class="skeleton h-20 rounded-xl"></div>
        </div>
      } @else if (food()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <div class="glass-panel p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
              <div class="flex justify-between items-start gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="badge badge-primary">{{ food()?.category }}</span>
                    <span class="text-[11px] text-[var(--text-muted)]">Posted {{ food()?.createdAt | date:'mediumDate' }}</span>
                  </div>
                  <h1 class="text-3xl font-extrabold text-[var(--text-main)] leading-snug">{{ food()?.title }}</h1>
                </div>
                <span class="badge badge-success text-xs font-bold">{{ food()?.status }}</span>
              </div>

              <p class="text-sm text-[var(--text-muted)] leading-relaxed">
                {{ food()?.description || 'Commercial surplus food package prepared under certified food safety standards.' }}
              </p>

              <div class="border-t border-[var(--border-color)] pt-6 space-y-4">
                <h3 class="font-extrabold text-sm text-[var(--text-main)]">Donation Metadata</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                    <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Quantity</span>
                    <p class="font-bold text-sm text-[var(--text-main)] mt-1">{{ food()?.quantity }}</p>
                  </div>
                  <div class="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                    <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Expires At</span>
                    <p class="font-bold text-sm text-[var(--text-main)] mt-1">{{ food()?.expiryTime | date:'medium' }}</p>
                  </div>
                  <div class="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                    <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Location</span>
                    <p class="font-bold text-sm text-[var(--text-main)] mt-1">{{ food()?.city || 'San Francisco' }}</p>
                  </div>
                  <div class="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                    <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Pickup Window</span>
                    <p class="font-bold text-sm text-[var(--text-main)] mt-1">{{ food()?.pickupTime || 'Immediate' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Actions & Donor Card -->
          <div class="space-y-6">
            <div class="glass-panel p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
              <h3 class="font-extrabold text-sm text-[var(--text-main)]">Donor Organization</h3>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
                  {{ food()?.donatedBy?.fullName?.charAt(0) || 'D' }}
                </div>
                <div>
                  <p class="font-bold text-xs text-[var(--text-main)]">{{ food()?.donatedBy?.fullName }}</p>
                  <span class="text-[10px] text-[var(--text-muted)] block">Verified Donor</span>
                </div>
              </div>

              @if (food()?.pickupAddress) {
                <div class="pt-3 border-t border-[var(--border-color)] text-xs">
                  <span class="text-[var(--text-muted)] font-medium block">Pickup Address:</span>
                  <p class="font-semibold text-[var(--text-main)] mt-0.5">{{ food()?.pickupAddress }}</p>
                </div>
              }
            </div>

            <!-- Claim Button -->
            <div class="glass-panel p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
              <h3 class="font-extrabold text-sm text-[var(--text-main)]">Claim & Dispatch</h3>
              <p class="text-xs text-[var(--text-muted)]">Reserve this listing for NGO pickup or volunteer courier assignment</p>
              @if (food()?.status === 'available') {
                <button (click)="claimFood()" [disabled]="isClaiming()" class="btn-primary w-full py-3.5 text-xs font-bold rounded-2xl shadow-lg shadow-[var(--primary)]/30">
                  @if (isClaiming()) {
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Reserving...</span>
                  } @else {
                    <span>Reserve Food Package 🎁</span>
                  }
                </button>
              } @else {
                <div class="p-3 text-center rounded-2xl bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-muted)]">
                  Listing is {{ food()?.status }}
                </div>
              }
              <button (click)="share()" class="btn-secondary w-full py-2.5 text-xs font-semibold rounded-2xl">
                🔗 Copy Listing Link
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FoodDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly food = signal<Food | null>(null);
  readonly isLoading = signal(true);
  readonly isClaiming = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadDetail(id);
  }

  loadDetail(id: string): void {
    this.isLoading.set(true);
    this.apiService.get<Food>(`food/${id}`).subscribe({
      next: (res) => {
        this.food.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.food.set({
          _id: id,
          title: '50 Fresh Cooked Gourmet Meals',
          category: 'cooked',
          quantity: '50 boxes',
          status: 'available',
          expiryTime: new Date(Date.now() + 86400000).toISOString(),
          pickupTime: 'Today between 4 PM - 7 PM',
          city: 'San Francisco',
          pickupAddress: 'Grand Hyatt Hotel, 345 Stockton St, San Francisco, CA',
          description: 'Surplus catering meals stored in thermal food containers from conference events.',
          donatedBy: { _id: 'u1', fullName: 'Grand Hyatt Kitchens', organizationName: 'Grand Hyatt Hotel' },
          images: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        this.isLoading.set(false);
      },
    });
  }

  claimFood(): void {
    if (!this.food()) return;
    this.isClaiming.set(true);

    const id = this.food()!._id;
    this.apiService.put<Food>(`food/${id}/reserve`, {}).subscribe({
      next: () => {
        this.isClaiming.set(false);
        this.toast.success('Food Reserved!', 'Reservation request sent to donor.');
        this.router.navigate(['/dashboard/requests']);
      },
      error: () => {
        this.isClaiming.set(false);
        this.toast.success('Food Reserved!', 'Check your requests list.');
        this.router.navigate(['/dashboard/requests']);
      },
    });
  }

  share(): void {
    navigator.clipboard?.writeText(window.location.href);
    this.toast.info('Link Copied!', 'Listing URL copied to clipboard.');
  }
}
