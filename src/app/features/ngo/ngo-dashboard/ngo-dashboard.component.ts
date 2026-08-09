import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-ngo-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
          <h1 class="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">NGO Partner Operations</h1>
          <p class="text-xs text-[var(--text-muted)] mt-1">Coordinate community feeding programs and bulk food requests</p>
        </div>
        <a routerLink="/dashboard/requests" class="btn-primary py-3 px-6 text-xs font-bold rounded-2xl shadow-lg shadow-[var(--primary)]/30">
          + Post Bulk Demand Request
        </a>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Beneficiaries Served</span>
            <span class="text-xl">🏢</span>
          </div>
          <p class="text-3xl font-extrabold text-[var(--text-main)]">1,450</p>
        </div>

        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Meals Claimed</span>
            <span class="text-xl">🍱</span>
          </div>
          <p class="text-3xl font-extrabold text-[var(--text-main)]">320</p>
        </div>

        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Distribution Hubs</span>
            <span class="text-xl">📍</span>
          </div>
          <p class="text-3xl font-extrabold text-[var(--text-main)]">4</p>
        </div>

        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Assigned Couriers</span>
            <span class="text-xl">🤝</span>
          </div>
          <p class="text-3xl font-extrabold text-[var(--primary)]">18</p>
        </div>
      </div>

      <!-- Active Batches Table -->
      <div class="zh-card p-6 sm:p-8 space-y-4 overflow-hidden">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-lg text-[var(--text-main)]">Active Bulk Demand & Dispatch Batches</h3>
          <a routerLink="/dashboard/requests" class="text-xs font-bold text-[var(--primary)] hover:underline">Manage Requests →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[var(--text-main)]">
            <thead class="bg-[var(--bg-surface)] text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--border-color)]">
              <tr>
                <th class="py-4 px-6">Batch Title</th>
                <th class="py-4 px-6">Target Quantity</th>
                <th class="py-4 px-6">Source Donor</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Dispatch Schedule</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              @for (batch of activeBatches(); track batch.id) {
                <tr class="hover:bg-[var(--bg-surface)]/50 transition-colors">
                  <td class="py-4 px-6 font-bold text-[var(--text-main)]">{{ batch.title }}</td>
                  <td class="py-4 px-6 font-semibold">{{ batch.qty }}</td>
                  <td class="py-4 px-6 text-[var(--text-muted)]">{{ batch.donor }}</td>
                  <td class="py-4 px-6">
                    <span class="badge badge-{{ batch.status === 'Dispatched' ? 'success' : 'warning' }} text-[10px]">
                      {{ batch.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-[var(--text-muted)] font-medium">{{ batch.time }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class NgoDashboardComponent {
  private readonly toast = inject(ToastService);

  readonly activeBatches = signal([
    { id: '1', title: 'Weekend Shelter Dinner Drive', qty: '200 meals', donor: 'Grand Hyatt Kitchens', status: 'Dispatched', time: 'Today 6:00 PM' },
    { id: '2', title: 'Community Kitchen Staple Package', qty: '150 kg Grains', donor: 'Organic Wholesale Co.', status: 'Reserved', time: 'Tomorrow 10:00 AM' },
  ]);
}
