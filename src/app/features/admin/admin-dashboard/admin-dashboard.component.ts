import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-dashboard',
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
      <div class="space-y-2">
        <span class="badge badge-danger text-[10px]">SYSTEM ADMIN CONTROL PANEL</span>
        <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Platform Administration & Audit</h1>
        <p class="text-xs text-[#5B5B6A]">Monitor enterprise platform activity, security logs, and role permissions</p>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Registered Users</span>
            <span class="text-xl">👥</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">1,280</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Total Listings</span>
            <span class="text-xl">🍱</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1A1A1A]">4,820</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Platform Uptime</span>
            <span class="text-xl">🛡️</span>
          </div>
          <p class="text-3xl font-extrabold text-emerald-600">99.9%</p>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-2 border border-[#E8DDD3]">
          <div class="flex justify-between items-center text-xs font-bold text-[#5B5B6A]">
            <span>Security Flags</span>
            <span class="text-xl">⚠️</span>
          </div>
          <p class="text-3xl font-extrabold text-[#7743DB]">0</p>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="glass-panel rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-lg text-[#1A1A1A]">System Audit Logs</h3>
          <button (click)="refreshLogs()" class="btn-secondary py-1.5 px-4 text-xs font-semibold rounded-xl">
            Refresh Logs 🔄
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A1A1A]">
            <thead class="bg-[#F7EFE5] text-[#5B5B6A] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DDD3]">
              <tr>
                <th class="py-4 px-6">Timestamp</th>
                <th class="py-4 px-6">Actor</th>
                <th class="py-4 px-6">Action Event</th>
                <th class="py-4 px-6">Resource ID</th>
                <th class="py-4 px-6">IP Address</th>
                <th class="py-4 px-6 text-right">Severity</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8DDD3]">
              @for (log of auditLogs(); track log.id) {
                <tr class="hover:bg-[#F7EFE5]/50 transition-colors">
                  <td class="py-4 px-6 font-mono text-[#5B5B6A]">{{ log.timestamp }}</td>
                  <td class="py-4 px-6 font-bold text-[#1A1A1A]">{{ log.actor }}</td>
                  <td class="py-4 px-6 font-semibold">{{ log.action }}</td>
                  <td class="py-4 px-6 font-mono text-[#7743DB]">{{ log.resource }}</td>
                  <td class="py-4 px-6 text-[#5B5B6A]">{{ log.ip }}</td>
                  <td class="py-4 px-6 text-right">
                    <span class="badge badge-{{ log.severity === 'HIGH' ? 'danger' : 'success' }} text-[10px]">
                      {{ log.severity }}
                    </span>
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
export class AdminDashboardComponent {
  private readonly toast = inject(ToastService);

  readonly auditLogs = signal([
    { id: '1', timestamp: '2026-08-02 01:14:02', actor: 'admin@zerohunger.org', action: 'USER_ROLE_UPDATE', resource: 'user_66a9b12', ip: '192.168.1.1', severity: 'INFO' },
    { id: '2', timestamp: '2026-08-02 01:10:45', actor: 'system_cron', action: 'EXPIRED_FOOD_CLEANUP', resource: 'food_collection', ip: '127.0.0.1', severity: 'INFO' },
    { id: '3', timestamp: '2026-08-02 00:55:12', actor: 'chef@grandhyatt.com', action: 'FOOD_DONATION_CREATE', resource: 'food_9823ab', ip: '103.22.45.12', severity: 'INFO' },
  ]);

  refreshLogs(): void {
    this.toast.info('Audit Logs Refreshed', 'Showing latest 50 security events.');
  }
}
