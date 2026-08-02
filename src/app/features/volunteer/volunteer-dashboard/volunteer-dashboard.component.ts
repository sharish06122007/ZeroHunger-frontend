import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

export interface VolunteerTask {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  foodTitle: string;
  quantity: string;
  urgency: 'high' | 'medium' | 'low';
  assignedTo?: string;
  status: 'open' | 'in_progress' | 'completed';
}

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule],
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
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Volunteer Mission Control</h1>
        <p class="text-xs text-[#5B5B6A] mt-1">Accept nearby food rescue pickup and distribution missions</p>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Missions Nearby</span>
            <span class="text-xl">🚗</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">8</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Missions Completed</span>
            <span class="text-xl">🏅</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">24</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Volunteer Rating</span>
            <span class="text-xl">⭐</span>
          </div>
          <p class="text-3xl font-extrabold text-[#7743DB]">4.9 <span class="text-xs text-[#5B5B6A]">/ 5.0</span></p>
        </div>
      </div>

      <!-- Available Missions Table -->
      <div class="glass-panel rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-xl overflow-hidden space-y-4 p-6 sm:p-8">
        <h3 class="font-extrabold text-lg text-[#1A1A1A]">Active Rescue Missions</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A1A1A]">
            <thead class="bg-[#F7EFE5] text-[#5B5B6A] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DDD3]">
              <tr>
                <th class="py-4 px-6">Task ID</th>
                <th class="py-4 px-6">Food Item</th>
                <th class="py-4 px-6">Pickup Point</th>
                <th class="py-4 px-6">Dropoff Shelter</th>
                <th class="py-4 px-6">Urgency</th>
                <th class="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8DDD3]">
              @for (task of tasks(); track task._id) {
                <tr class="hover:bg-[#F7EFE5]/50 transition-colors">
                  <td class="py-4 px-6 font-mono text-[#7743DB] font-bold">#{{ task._id }}</td>
                  <td class="py-4 px-6 font-bold text-[#1A1A1A]">{{ task.foodTitle }} ({{ task.quantity }})</td>
                  <td class="py-4 px-6 text-[#5B5B6A]">📍 {{ task.pickupLocation }}</td>
                  <td class="py-4 px-6 text-[#5B5B6A]">🏠 {{ task.dropoffLocation }}</td>
                  <td class="py-4 px-6">
                    <span class="badge badge-{{ task.urgency === 'high' ? 'danger' : 'warning' }} text-[10px]">
                      {{ task.urgency | uppercase }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    @if (task.status === 'open') {
                      <button (click)="acceptTask(task._id)" class="btn-primary py-1.5 px-4 text-[10px] font-bold rounded-xl shadow-md">
                        Accept Mission 🚀
                      </button>
                    } @else if (task.status === 'in_progress') {
                      <button (click)="completeTask(task._id)" class="btn-secondary py-1.5 px-4 text-[10px] font-bold rounded-xl text-emerald-600">
                        Mark Delivered ✅
                      </button>
                    } @else {
                      <span class="badge badge-success text-[10px]">Delivered</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class VolunteerDashboardComponent implements OnInit {
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);

  readonly tasks = signal<VolunteerTask[]>([
    { _id: 'VOL-201', foodTitle: '50 Hot Dinner Meals', quantity: '50 boxes', pickupLocation: 'Grand Hyatt Kitchens', dropoffLocation: 'St. Jude Shelter', urgency: 'high', status: 'open' },
    { _id: 'VOL-202', foodTitle: 'Surplus Sourdough Bread', quantity: '20 kg', pickupLocation: 'Green Harvest Bakery', dropoffLocation: 'City Food Bank', urgency: 'medium', status: 'open' },
    { _id: 'VOL-203', foodTitle: 'Fresh Vegetables & Produce', quantity: '35 kg', pickupLocation: 'Organic Farms Dock', dropoffLocation: 'Hope Center', urgency: 'low', status: 'in_progress' },
  ]);

  ngOnInit(): void {}

  acceptTask(id: string): void {
    this.tasks.update(ts => ts.map(t => t._id === id ? { ...t, status: 'in_progress' } : t));
    this.toast.success('Mission Accepted!', 'Navigate to pickup location.');
  }

  completeTask(id: string): void {
    this.tasks.update(ts => ts.map(t => t._id === id ? { ...t, status: 'completed' } : t));
    this.toast.success('Mission Completed!', 'Impact score updated on profile.');
  }
}
