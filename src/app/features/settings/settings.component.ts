import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up pb-12">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[var(--text-main)] mb-1">Platform Control & Settings</h1>
          <p class="text-sm text-[var(--text-muted)] font-medium">Configure organization details, routing rules, and security.</p>
        </div>
        <button class="btn-primary flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Save Configuration
        </button>
      </div>

      <!-- Settings Layout -->
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar Navigation -->
        <div class="w-full lg:w-64 shrink-0">
          <div class="zh-card p-2 space-y-1">
            <button (click)="activeTab = 'profile'" [class.bg-[var(--primary)]]="activeTab === 'profile'" [class.text-white]="activeTab === 'profile'" [class.text-[var(--text-muted)]]="activeTab !== 'profile'" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-[var(--primary)]/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Admin Profile
            </button>
            <button (click)="activeTab = 'organization'" [class.bg-[var(--primary)]]="activeTab === 'organization'" [class.text-white]="activeTab === 'organization'" [class.text-[var(--text-muted)]]="activeTab !== 'organization'" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-[var(--primary)]/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              Organization
            </button>
            <button (click)="activeTab = 'routing'" [class.bg-[var(--primary)]]="activeTab === 'routing'" [class.text-white]="activeTab === 'routing'" [class.text-[var(--text-muted)]]="activeTab !== 'routing'" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-[var(--primary)]/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              Location & Routing
            </button>
            <button (click)="activeTab = 'security'" [class.bg-[var(--primary)]]="activeTab === 'security'" [class.text-white]="activeTab === 'security'" [class.text-[var(--text-muted)]]="activeTab !== 'security'" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-[var(--primary)]/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Security
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 zh-card p-6 sm:p-8">
          
          <!-- Organization Tab -->
          @if (activeTab === 'organization') {
            <div class="space-y-6">
              <div>
                <h2 class="text-lg font-black text-[var(--text-main)] mb-1">Organization Details</h2>
                <p class="text-xs text-[var(--text-muted)]">Manage the public identity of ZeroHunger.</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="zh-label" for="orgName">Organization Name</label>
                  <input type="text" id="orgName" class="zh-input" value="ZeroHunger Foundation" />
                </div>
                <div>
                  <label class="zh-label" for="orgEmail">Official Email</label>
                  <input type="email" id="orgEmail" class="zh-input" value="contact@zerohunger.org" />
                </div>
                <div class="md:col-span-2">
                  <label class="zh-label" for="orgMission">Mission Statement</label>
                  <textarea id="orgMission" class="zh-input h-24 resize-none">Connecting Food. Supporting People. Building Hope.</textarea>
                </div>
              </div>
            </div>
          }

          <!-- Routing & Location Tab -->
          @if (activeTab === 'routing') {
            <div class="space-y-8">
              <div>
                <h2 class="text-lg font-black text-[var(--text-main)] mb-1">Location & Assignment Rules</h2>
                <p class="text-xs text-[var(--text-muted)]">Configure how requests are automatically routed to team members.</p>
              </div>

              <!-- Headquarters -->
              <div class="space-y-4">
                <h3 class="text-sm font-extrabold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">Organization Headquarters</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="md:col-span-2">
                    <label class="zh-label">Headquarters Address</label>
                    <div class="flex gap-2">
                      <input type="text" class="zh-input flex-1" value="ZeroHunger HQ, Anna Salai, Chennai" />
                      <button class="btn-secondary whitespace-nowrap">Open Map</button>
                    </div>
                  </div>
                  <div>
                    <label class="zh-label">Latitude</label>
                    <input type="text" class="zh-input" value="13.0827" />
                  </div>
                  <div>
                    <label class="zh-label">Longitude</label>
                    <input type="text" class="zh-input" value="80.2707" />
                  </div>
                </div>
              </div>

              <!-- Routing Rules -->
              <div class="space-y-4">
                <h3 class="text-sm font-extrabold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">Default Routing Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="zh-label">Default Service Radius (meters)</label>
                    <select class="zh-input">
                      <option value="100">100 m</option>
                      <option value="500" selected>500 m</option>
                      <option value="1000">1 km</option>
                      <option value="5000">5 km</option>
                    </select>
                  </div>
                  <div>
                    <label class="zh-label">Maximum Workload per Member</label>
                    <input type="number" class="zh-input" value="5" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="zh-label">Escalation Rule</label>
                    <select class="zh-input">
                      <option value="backup">Assign to Backup Member if Primary is Busy</option>
                      <option value="expand">Expand Radius and Search Again</option>
                      <option value="manual">Keep Pending for Manual Assignment</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Admin Profile Tab -->
          @if (activeTab === 'profile') {
            <div class="space-y-6">
              <div>
                <h2 class="text-lg font-black text-[var(--text-main)] mb-1">Administrator Profile</h2>
                <p class="text-xs text-[var(--text-muted)]">Your personal account settings.</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="zh-label">Full Name</label>
                  <input type="text" class="zh-input" value="Super Admin" />
                </div>
                <div>
                  <label class="zh-label">Email Address</label>
                  <input type="email" class="zh-input" value="admin@zerohunger.org" disabled />
                </div>
                <div>
                  <label class="zh-label">Role</label>
                  <input type="text" class="zh-input bg-gray-50" value="Organization Head" disabled />
                </div>
              </div>
            </div>
          }

          <!-- Security Tab -->
          @if (activeTab === 'security') {
            <div class="space-y-6">
              <div>
                <h2 class="text-lg font-black text-[var(--text-main)] mb-1">Account Security</h2>
                <p class="text-xs text-[var(--text-muted)]">Update your password and secure your account.</p>
              </div>
              <div class="max-w-md space-y-4">
                <div>
                  <label class="zh-label">Current Password</label>
                  <input type="password" class="zh-input" placeholder="••••••••" />
                </div>
                <div>
                  <label class="zh-label">New Password</label>
                  <input type="password" class="zh-input" placeholder="••••••••" />
                </div>
                <div>
                  <label class="zh-label">Confirm New Password</label>
                  <input type="password" class="zh-input" placeholder="••••••••" />
                </div>
                <button class="btn-primary w-full mt-2">Update Password</button>
              </div>
            </div>
          }

        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  activeTab: 'profile' | 'organization' | 'routing' | 'security' = 'organization';

  constructor() {}
  ngOnInit(): void {}
}
