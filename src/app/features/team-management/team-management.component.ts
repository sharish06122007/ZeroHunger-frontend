import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up pb-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[var(--text-main)] mb-1">Super Team Management</h1>
          <p class="text-sm text-[var(--text-muted)] font-medium">Manage organization structure, operational roles, and team assignments.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn-secondary flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Export Roster
          </button>
          <button class="btn-primary flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Member
          </button>
        </div>
      </div>

      <!-- Quick Team Stats -->
      <div class="grid grid-cols-5 gap-4">
        <div class="zh-card p-5 border-t-4 border-t-[var(--primary)] flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform">
          <p class="text-3xl font-black text-[var(--text-main)] mb-1">42</p>
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Members</p>
        </div>
        <div class="zh-card p-5 border-t-4 border-t-green-500 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform">
          <p class="text-3xl font-black text-green-600 mb-1">28</p>
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Available</p>
        </div>
        <div class="zh-card p-5 border-t-4 border-t-orange-500 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform">
          <p class="text-3xl font-black text-orange-600 mb-1">9</p>
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Busy / Max Tasks</p>
        </div>
        <div class="zh-card p-5 border-t-4 border-t-gray-400 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform">
          <p class="text-3xl font-black text-gray-500 mb-1">4</p>
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Offline / Break</p>
        </div>
        <div class="zh-card p-5 border-t-4 border-t-rose-500 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform">
          <p class="text-3xl font-black text-rose-600 mb-1">1</p>
          <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Suspended</p>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="flex items-center gap-4 bg-[var(--bg-surface)] p-2 rounded-2xl border border-[var(--border-color)]">
        <div class="flex-1 relative">
          <svg class="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search team members by name, role, or area..." class="w-full bg-transparent border-none text-xs pl-10 pr-4 py-2 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none" />
        </div>
        <div class="w-px h-6 bg-[var(--border-color)]"></div>
        <div class="flex items-center gap-2 pr-2">
          <select class="bg-transparent border-none text-xs font-bold text-[var(--text-main)] focus:outline-none cursor-pointer">
            <option>All Areas</option>
            <option>Area A (North)</option>
            <option>Area B (South)</option>
          </select>
          <select class="bg-transparent border-none text-xs font-bold text-[var(--text-main)] focus:outline-none cursor-pointer">
            <option>All Roles</option>
            <option>Area Manager</option>
            <option>Delivery Partner</option>
          </select>
        </div>
      </div>

      <!-- Team Members Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <!-- Member Card 1 -->
        <div class="zh-card p-0 overflow-hidden flex flex-col group cursor-pointer hover:border-[var(--primary)]/50 transition-colors">
          <div class="p-5 border-b border-[var(--border-color)] flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img src="https://ui-avatars.com/api/?name=Raj+Patel&background=123524&color=fff" alt="Avatar" class="w-12 h-12 rounded-xl object-cover shadow-sm" />
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">Raj Patel</h3>
                <p class="text-[11px] text-[var(--text-muted)] font-semibold">Delivery Partner</p>
                <div class="flex items-center gap-1 mt-1">
                  <span class="px-1.5 py-0.5 rounded-md bg-[var(--bg-main)] border border-[var(--border-color)] text-[9px] font-bold text-[var(--text-muted)]">Area A</span>
                </div>
              </div>
            </div>
            <div class="bg-green-500/10 text-green-700 px-2 py-1 rounded text-[10px] font-bold">AVAILABLE</div>
          </div>
          <div class="p-4 bg-[var(--bg-surface)]">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase">Current Workload</span>
              <span class="text-[10px] font-bold text-[var(--text-main)]">1 / 5 Tasks</span>
            </div>
            <!-- Workload bar -->
            <div class="w-full h-2 rounded-full bg-[var(--border-color)] overflow-hidden flex">
              <div class="h-full bg-green-500" style="width: 20%;"></div>
            </div>
          </div>
          <div class="p-3 border-t border-[var(--border-color)] flex items-center justify-between">
            <span class="text-[10px] font-semibold text-[var(--text-muted)]">Joined Mar 2025</span>
            <button class="text-[10px] font-bold text-[var(--primary)] hover:underline">Manage Profile</button>
          </div>
        </div>

        <!-- Member Card 2 -->
        <div class="zh-card p-0 overflow-hidden flex flex-col group cursor-pointer hover:border-[var(--primary)]/50 transition-colors">
          <div class="p-5 border-b border-[var(--border-color)] flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img src="https://ui-avatars.com/api/?name=Anita+Desai&background=3E7B27&color=fff" alt="Avatar" class="w-12 h-12 rounded-xl object-cover shadow-sm" />
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">Anita Desai</h3>
                <p class="text-[11px] text-[var(--text-muted)] font-semibold">Area Manager</p>
                <div class="flex items-center gap-1 mt-1">
                  <span class="px-1.5 py-0.5 rounded-md bg-[var(--bg-main)] border border-[var(--border-color)] text-[9px] font-bold text-[var(--text-muted)]">Area B</span>
                </div>
              </div>
            </div>
            <div class="bg-orange-500/10 text-orange-700 px-2 py-1 rounded text-[10px] font-bold">BUSY</div>
          </div>
          <div class="p-4 bg-[var(--bg-surface)]">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase">Current Workload</span>
              <span class="text-[10px] font-bold text-orange-600">5 / 5 Tasks</span>
            </div>
            <!-- Workload bar -->
            <div class="w-full h-2 rounded-full bg-[var(--border-color)] overflow-hidden flex">
              <div class="h-full bg-orange-500" style="width: 100%;"></div>
            </div>
          </div>
          <div class="p-3 border-t border-[var(--border-color)] flex items-center justify-between">
            <span class="text-[10px] font-semibold text-[var(--text-muted)]">Joined Jan 2026</span>
            <button class="text-[10px] font-bold text-[var(--primary)] hover:underline">Manage Profile</button>
          </div>
        </div>
        
        <!-- Member Card 3 -->
        <div class="zh-card p-0 overflow-hidden flex flex-col group cursor-pointer hover:border-[var(--primary)]/50 transition-colors opacity-75">
          <div class="p-5 border-b border-[var(--border-color)] flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img src="https://ui-avatars.com/api/?name=Vikram+Singh&background=85A947&color=fff" alt="Avatar" class="w-12 h-12 rounded-xl object-cover shadow-sm grayscale" />
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">Vikram Singh</h3>
                <p class="text-[11px] text-[var(--text-muted)] font-semibold">Volunteer Coordinator</p>
                <div class="flex items-center gap-1 mt-1">
                  <span class="px-1.5 py-0.5 rounded-md bg-[var(--bg-main)] border border-[var(--border-color)] text-[9px] font-bold text-[var(--text-muted)]">Area C</span>
                </div>
              </div>
            </div>
            <div class="bg-gray-200 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">OFFLINE</div>
          </div>
          <div class="p-4 bg-[var(--bg-surface)]">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase">Current Workload</span>
              <span class="text-[10px] font-bold text-[var(--text-muted)]">0 / 5 Tasks</span>
            </div>
            <!-- Workload bar -->
            <div class="w-full h-2 rounded-full bg-[var(--border-color)] overflow-hidden flex">
              <div class="h-full bg-gray-400" style="width: 0%;"></div>
            </div>
          </div>
          <div class="p-3 border-t border-[var(--border-color)] flex items-center justify-between">
            <span class="text-[10px] font-semibold text-[var(--text-muted)]">Last active 2 hrs ago</span>
            <button class="text-[10px] font-bold text-[var(--primary)] hover:underline">Manage Profile</button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class TeamManagementComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
