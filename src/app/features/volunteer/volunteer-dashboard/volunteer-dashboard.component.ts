import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { MapViewComponent, MapMarker } from '../../../shared/components/map-view/map-view.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, MapViewComponent],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="space-y-8 pb-12" @fadeIn>
      <!-- Volunteer Banner -->
      <div class="p-8 rounded-3xl bg-gradient-to-r from-[var(--text-main)] via-[var(--primary-deep)] to-[var(--primary)] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/10">
        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-extrabold text-[var(--text-light)] border border-white/15">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            VOLUNTEER MISSION CONTROL
          </div>
          <h1 class="text-3xl font-black tracking-tight">Active Rescue Missions 🚴</h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-xl">
            Accept food dispatch requests, navigate live route pickup points, and mark deliveries completed.
          </p>
        </div>
      </div>

      <!-- Volunteer Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Leaderboard Rank</span>
            <span class="text-2xl">🏆</span>
          </div>
          <p class="text-3xl font-black text-[var(--primary)]">#{{ stats().leaderboardRank }}</p>
          <span class="text-[11px] font-semibold text-emerald-600">Top 5% Volunteer</span>
        </div>

        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Rescue Score</span>
            <span class="text-2xl">⚡</span>
          </div>
          <p class="text-3xl font-black text-[var(--text-main)]">{{ stats().rescueScore }} pts</p>
          <span class="text-[11px] font-semibold text-emerald-600">Level 4 Courier</span>
        </div>

        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Distance Covered</span>
            <span class="text-2xl">🗺️</span>
          </div>
          <p class="text-3xl font-black text-[var(--text-main)]">{{ stats().distanceCoveredKm }} <span class="text-xs">km</span></p>
          <span class="text-[11px] font-semibold text-emerald-600">Green transport</span>
        </div>

        <div class="zh-card p-6 space-y-2 cursor-pointer">
          <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
            <span>Meals Delivered</span>
            <span class="text-2xl">🎁</span>
          </div>
          <p class="text-3xl font-black text-emerald-600">{{ stats().mealsDelivered }}</p>
          <span class="text-[11px] font-semibold text-emerald-600">★ {{ stats().volunteerRating }} Rating</span>
        </div>
      </div>

      <!-- Live Route Map Preview -->
      <div class="zh-card p-6 rounded-3xl border border-[var(--border-color)] bg-white/90 shadow-md space-y-3">
        <h3 class="font-extrabold text-sm text-[var(--text-main)]">Live Rescue Map & Pickup Routes</h3>
        <div class="h-64 w-full">
          <app-map-view [markers]="mapMarkers()"></app-map-view>
        </div>
      </div>

      <!-- Active & Available Missions Table -->
      <div class="zh-card p-6 sm:p-8 space-y-6 overflow-hidden">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-black text-lg text-[var(--text-main)]">Mission Dispatch Center</h3>
            <p class="text-xs text-[var(--text-muted)]">Select available missions or complete assigned dispatches</p>
          </div>
          <button (click)="fetchMissions()" class="btn-secondary py-1.5 px-4 text-xs font-semibold rounded-xl">
            🔄 Refresh Missions
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[var(--text-main)]">
            <thead class="bg-[var(--bg-surface)] text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--border-color)]">
              <tr>
                <th class="py-4 px-6">Mission / Food Item</th>
                <th class="py-4 px-6">Pickup Point</th>
                <th class="py-4 px-6">Delivery Target</th>
                <th class="py-4 px-6">Est. Distance</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              <!-- Assigned / In-Transit Missions First -->
              @for (mission of assignedMissions(); track mission._id) {
                <tr class="bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-colors">
                  <td class="py-4 px-6 font-bold text-[var(--text-main)]">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-primary text-[9px]">ASSIGNED TO YOU</span>
                      <span class="line-clamp-1">{{ mission.food?.title || 'Surplus Meal Rescue' }}</span>
                    </div>
                    <div class="text-[10px] text-[var(--text-muted)] mt-0.5">{{ mission.food?.quantity || '30 servings' }}</div>
                  </td>
                  <td class="py-4 px-6 text-[var(--text-muted)]">{{ mission.pickupAddress || mission.food?.pickupAddress || 'Restaurant HQ' }}</td>
                  <td class="py-4 px-6 text-[var(--text-muted)]">{{ mission.deliveryAddress || 'Community Shelter' }}</td>
                  <td class="py-4 px-6 font-semibold text-[var(--primary)]">2.4 km</td>
                  <td class="py-4 px-6">
                    <span class="badge badge-warning text-[10px] animate-pulse">In-Transit 🚚</span>
                  </td>
                  <td class="py-4 px-6 text-right space-x-2">
                    <button (click)="markDelivered(mission)" class="btn-primary py-1.5 px-3 text-[10px] rounded-lg">
                      Mark Delivered ✓
                    </button>
                  </td>
                </tr>
              }

              <!-- Available Missions -->
              @for (mission of availableMissions(); track mission._id) {
                <tr class="hover:bg-[var(--bg-surface)]/50 transition-colors">
                  <td class="py-4 px-6 font-bold text-[var(--text-main)]">
                    <div>{{ mission.food?.title || 'Surplus Food Rescue' }}</div>
                    <div class="text-[10px] text-[var(--text-muted)] font-normal">{{ mission.food?.quantity || '25 boxes' }}</div>
                  </td>
                  <td class="py-4 px-6 text-[var(--text-muted)]">{{ mission.pickupAddress || 'Local Bakery' }}</td>
                  <td class="py-4 px-6 text-[var(--text-muted)]">{{ mission.deliveryAddress || 'NGO Shelter' }}</td>
                  <td class="py-4 px-6 font-semibold text-[var(--text-muted)]">3.1 km</td>
                  <td class="py-4 px-6">
                    <span class="badge badge-success text-[10px]">Open Rescue</span>
                  </td>
                  <td class="py-4 px-6 text-right space-x-2">
                    <button (click)="acceptMission(mission)" class="btn-secondary py-1.5 px-3 text-[10px] rounded-lg">
                      Accept Mission 🚴
                    </button>
                  </td>
                </tr>
              } @empty {
                @if (assignedMissions().length === 0) {
                  <tr>
                    <td colspan="6" class="py-8 text-center text-xs text-[var(--text-muted)]">
                      No active missions available right now. New missions will appear automatically!
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class VolunteerDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly availableMissions = signal<any[]>([]);
  readonly assignedMissions = signal<any[]>([]);
  readonly mapMarkers = signal<MapMarker[]>([]);

  readonly stats = signal({
    completedMissions: 14,
    activeMissions: 1,
    mealsDelivered: 490,
    distanceCoveredKm: 58.8,
    volunteerRating: 4.9,
    leaderboardRank: 3,
    rescueScore: 1730,
  });

  ngOnInit(): void {
    this.fetchMissions();
    this.fetchStats();
  }

  fetchMissions(): void {
    this.api.get<any>('volunteer/missions').subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.availableMissions.set(data?.available || []);
        this.assignedMissions.set(data?.assigned || []);
        this.buildMapMarkers();
      },
      error: () => {},
    });
  }

  fetchStats(): void {
    this.api.get<any>('volunteer/stats').subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data) this.stats.set(data);
      },
      error: () => {},
    });
  }

  acceptMission(mission: any): void {
    this.api.post('volunteer/accept', { requestId: mission._id }).subscribe({
      next: () => {
        this.toast.success('Mission Accepted! 🚴', 'Proceeding to pickup point.');
        this.fetchMissions();
      },
    });
  }

  markDelivered(mission: any): void {
    this.api.post('volunteer/deliver', { requestId: mission._id }).subscribe({
      next: () => {
        this.toast.success('Mission Completed! 🎉', 'Food delivered safely to NGO.');
        this.fetchMissions();
        this.fetchStats();
      },
    });
  }

  private buildMapMarkers(): void {
    const markers: MapMarker[] = [
      { lat: 13.0827, lng: 80.2707, title: 'Your Volunteer Location', type: 'volunteer' },
      { lat: 13.0878, lng: 80.2785, title: 'Taj Hotel Pickup', type: 'food', description: '50 cooked meals' },
      { lat: 13.0722, lng: 80.2612, title: 'Asha NGO Drop Point', type: 'ngo', description: 'Community Kitchen' },
    ];
    this.mapMarkers.set(markers);
  }
}
