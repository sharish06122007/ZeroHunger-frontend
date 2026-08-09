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
          <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">NGO Partner Operations</h1>
          <p class="text-xs text-[#5B5B6A] mt-1">Coordinate community feeding programs and bulk food requests</p>
        </div>
        <a routerLink="/dashboard/requests" class="btn-primary py-3 px-6 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
          + Post Bulk Demand Request
        </a>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Beneficiaries Served</span>
            <span class="text-xl">🏢</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">1,450</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Meals Claimed</span>
            <span class="text-xl">🍱</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">320</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Distribution Hubs</span>
            <span class="text-xl">📍</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">4</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Assigned Couriers</span>
            <span class="text-xl">🤝</span>
          </div>
          <p class="text-3xl font-extrabold text-[#7743DB]">18</p>
        </div>
      </div>

      <!-- Active Batches Table -->
      <div class="glass-panel rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-lg text-[#1A1A1A]">Active Bulk Demand & Dispatch Batches</h3>
          <a routerLink="/dashboard/requests" class="text-xs font-bold text-[#7743DB] hover:underline">Manage Requests →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A1A1A]">
            <thead class="bg-[#F7EFE5] text-[#5B5B6A] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DDD3]">
              <tr>
                <th class="py-4 px-6">Batch Title</th>
                <th class="py-4 px-6">Target Quantity</th>
                <th class="py-4 px-6">Source Donor</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Dispatch Schedule</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8DDD3]">
              @for (batch of activeBatches(); track batch.id) {
                <tr class="hover:bg-[#F7EFE5]/50 transition-colors">
                  <td class="py-4 px-6 font-bold text-[#1A1A1A]">{{ batch.title }}</td>
                  <td class="py-4 px-6 font-semibold">{{ batch.qty }}</td>
                  <td class="py-4 px-6 text-[#5B5B6A]">{{ batch.donor }}</td>
                  <td class="py-4 px-6">
                    <span class="badge badge-{{ batch.status === 'Dispatched' ? 'success' : 'warning' }} text-[10px]">
                      {{ batch.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-[#5B5B6A] font-medium">{{ batch.time }}</td>
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
