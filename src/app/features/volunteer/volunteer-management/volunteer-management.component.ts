import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volunteer-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up pb-12">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[var(--text-main)] mb-1">Volunteer Management</h1>
          <p class="text-sm text-[var(--text-muted)] font-medium">Manage volunteer approvals, area assignments, and performance.</p>
        </div>
        <button class="btn-primary flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Invite Volunteer
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="zh-card p-4 border-l-4 border-[var(--primary)]">
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Volunteers</p>
          <p class="text-2xl font-black text-[var(--text-main)]">124</p>
        </div>
        <div class="zh-card p-4 border-l-4 border-green-500">
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Active Now</p>
          <p class="text-2xl font-black text-green-600">18</p>
        </div>
        <div class="zh-card p-4 border-l-4 border-amber-500">
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Busy / Assigned</p>
          <p class="text-2xl font-black text-amber-600">12</p>
        </div>
        <div class="zh-card p-4 border-l-4 border-rose-500">
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Pending Approval</p>
          <p class="text-2xl font-black text-rose-600">3</p>
        </div>
      </div>

      <!-- Volunteers Table -->
      <div class="zh-card p-0 overflow-hidden mt-4">
        <div class="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
          <h3 class="font-bold text-[var(--text-main)]">Volunteer Roster</h3>
          <input type="text" class="zh-input text-xs w-64" placeholder="Search volunteers..." />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[var(--bg-surface)] text-[var(--text-muted)] font-bold uppercase text-[10px]">
              <tr>
                <th class="py-3 px-5">Volunteer Name</th>
                <th class="py-3 px-5">Contact</th>
                <th class="py-3 px-5">Assigned Area</th>
                <th class="py-3 px-5">Status</th>
                <th class="py-3 px-5">Completed Tasks</th>
                <th class="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              <!-- Example row -->
              <tr class="hover:bg-[var(--bg-surface)] transition-colors">
                <td class="py-4 px-5 font-bold text-[var(--text-main)]">Rahul Sharma</td>
                <td class="py-4 px-5 text-[var(--text-muted)]">rahul&#64;example.com</td>
                <td class="py-4 px-5 font-semibold text-[var(--primary)]">Area A (North)</td>
                <td class="py-4 px-5"><span class="px-2 py-1 rounded bg-green-500/10 text-green-700 text-[10px] font-bold">AVAILABLE</span></td>
                <td class="py-4 px-5 font-bold text-[var(--text-main)]">42 Deliveries</td>
                <td class="py-4 px-5 text-right space-x-2">
                  <button class="text-[var(--primary)] font-bold text-[11px] hover:underline">Assign Area</button>
                </td>
              </tr>
              <!-- Example row -->
              <tr class="hover:bg-[var(--bg-surface)] transition-colors">
                <td class="py-4 px-5 font-bold text-[var(--text-main)]">Priya Patel</td>
                <td class="py-4 px-5 text-[var(--text-muted)]">priya&#64;example.com</td>
                <td class="py-4 px-5 font-semibold text-[var(--primary)]">Area C (East)</td>
                <td class="py-4 px-5"><span class="px-2 py-1 rounded bg-amber-500/10 text-amber-700 text-[10px] font-bold">BUSY</span></td>
                <td class="py-4 px-5 font-bold text-[var(--text-main)]">18 Deliveries</td>
                <td class="py-4 px-5 text-right space-x-2">
                  <button class="text-[var(--primary)] font-bold text-[11px] hover:underline">Assign Area</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class VolunteerManagementComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
