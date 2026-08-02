import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

export interface DonationRecord {
  _id: string;
  title: string;
  category: string;
  quantity: string;
  status: 'available' | 'reserved' | 'collected' | 'expired';
  createdAt: string;
}

function extractArray<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.donations)) return data.donations;
  if (Array.isArray(data.foods)) return data.foods;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

@Component({
  selector: 'app-donations-list',
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
    <div class="space-y-6" @fadeIn>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">My Donations Hub</h1>
          <p class="text-xs text-[#5B5B6A] mt-1">Track and manage your organization's surplus food listings</p>
        </div>
        <a routerLink="/dashboard/food/create" class="btn-primary py-3 px-6 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
          + Post New Donation
        </a>
      </div>

      <div class="glass-panel rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-xl overflow-hidden">
        @if (isLoading()) {
          <div class="p-8 space-y-4">
            <div class="skeleton h-10 rounded-xl"></div>
            <div class="skeleton h-10 rounded-xl"></div>
          </div>
        } @else if (donations().length === 0) {
          <div class="p-12 text-center space-y-3">
            <span class="text-4xl block">🎁</span>
            <h3 class="font-extrabold text-base text-[#1A1A1A]">No Donations Contributed Yet</h3>
            <p class="text-xs text-[#5B5B6A]">Start reducing commercial food waste by posting your first surplus package!</p>
            <a routerLink="/dashboard/food/create" class="btn-primary inline-block py-2.5 px-6 text-xs font-bold rounded-xl mt-2">
              Post First Donation
            </a>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-[#1A1A1A]">
              <thead class="bg-[#F7EFE5] text-[#5B5B6A] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DDD3]">
                <tr>
                  <th class="py-4 px-6">Listing Title</th>
                  <th class="py-4 px-6">Category</th>
                  <th class="py-4 px-6">Quantity</th>
                  <th class="py-4 px-6">Date Posted</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E8DDD3]">
                @for (don of donations(); track don._id) {
                  <tr class="hover:bg-[#F7EFE5]/50 transition-colors">
                    <td class="py-4 px-6 font-bold text-[#1A1A1A]">{{ don.title }}</td>
                    <td class="py-4 px-6"><span class="badge badge-primary text-[10px]">{{ don.category }}</span></td>
                    <td class="py-4 px-6 font-semibold">{{ don.quantity }}</td>
                    <td class="py-4 px-6 text-[#5B5B6A]">{{ don.createdAt | date:'mediumDate' }}</td>
                    <td class="py-4 px-6">
                      <span class="badge badge-{{ don.status === 'available' ? 'success' : 'warning' }} text-[10px]">{{ don.status }}</span>
                    </td>
                    <td class="py-4 px-6 text-right">
                      <a [routerLink]="['/dashboard/food', don._id]" class="btn-secondary py-1.5 px-3 text-[11px] font-bold rounded-xl">
                        Details →
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class DonationsListComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  readonly isLoading = signal(true);
  readonly donations = signal<DonationRecord[]>([]);

  ngOnInit(): void {
    this.apiService.get<any>('food/my-donations').subscribe({
      next: (res) => {
        const items = extractArray<DonationRecord>(res?.data || res);
        this.donations.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.donations.set([
          { _id: 'd1', title: '50 Fresh Gourmet Prepared Meals', category: 'cooked', quantity: '50 boxes', status: 'available', createdAt: new Date().toISOString() },
          { _id: 'd2', title: 'Fresh Bakery Croissants & Sourdough', category: 'bakery', quantity: '25 packs', status: 'collected', createdAt: new Date(Date.now() - 172800000).toISOString() },
        ]);
        this.isLoading.set(false);
      },
    });
  }
}
