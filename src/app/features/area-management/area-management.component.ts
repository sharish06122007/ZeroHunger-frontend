import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up pb-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[var(--text-main)] mb-1">Service Territories & Areas</h1>
          <p class="text-sm text-[var(--text-muted)] font-medium">Manage geographical boundaries, radius assignments, and area coordinators.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn-primary flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Create New Area
          </button>
        </div>
      </div>

      <!-- Area Cards List -->
      <div class="space-y-4">
        
        <!-- Area Card 1 -->
        <div class="zh-card p-0 overflow-hidden group">
          <div class="flex flex-col md:flex-row">
            
            <!-- Map Preview (Left) -->
            <div class="w-full md:w-64 h-48 md:h-auto bg-[#E5E3DF] relative flex items-center justify-center border-r border-[var(--border-color)]">
              <!-- Mock Map Roads / Texture -->
              <div class="absolute inset-0 opacity-[0.05]" style="background-image: radial-gradient(circle at 2px 2px, black 1px, transparent 0); background-size: 16px 16px;"></div>
              <!-- Radius Visualization -->
              <div class="w-32 h-32 rounded-full border-2 border-[var(--primary)]/40 bg-[var(--primary)]/10 flex items-center justify-center relative z-10">
                <div class="w-3 h-3 bg-[var(--primary)] rounded-full shadow-md"></div>
              </div>
              <div class="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-[9px] font-bold px-2 py-1 rounded shadow text-gray-700">North Bangalore</div>
            </div>

            <!-- Details (Right) -->
            <div class="flex-1 p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="font-black text-xl text-[var(--text-main)]">Area A (North)</h3>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-700">ACTIVE</span>
                  </div>
                  <p class="text-xs text-[var(--text-muted)] font-medium">Covers Yelahanka, Hebbal, and Sahakar Nagar</p>
                </div>
                <button class="p-2 hover:bg-[var(--bg-surface)] rounded-xl text-[var(--text-muted)] transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                </button>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Assigned Manager</p>
                  <div class="flex items-center gap-2">
                    <img src="https://ui-avatars.com/api/?name=Suresh+K&background=123524&color=fff" class="w-6 h-6 rounded-md object-cover" />
                    <span class="text-xs font-bold text-[var(--text-main)]">Suresh K.</span>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Backup Member</p>
                  <div class="flex items-center gap-2">
                    <img src="https://ui-avatars.com/api/?name=Priya+M&background=85A947&color=fff" class="w-6 h-6 rounded-md object-cover" />
                    <span class="text-xs font-bold text-[var(--text-main)]">Priya M.</span>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Service Radius</p>
                  <p class="text-sm font-bold text-[var(--text-main)]">5.0 km</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Current Operations</p>
                  <p class="text-sm font-bold text-orange-600">12 Active Requests</p>
                </div>
              </div>

              <div class="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                <button class="text-xs font-bold text-[var(--primary)] hover:underline">Edit Configuration</button>
                <div class="w-1 h-1 rounded-full bg-gray-300"></div>
                <button class="text-xs font-bold text-[var(--primary)] hover:underline">View on Operations Map</button>
                <div class="w-1 h-1 rounded-full bg-gray-300"></div>
                <button class="text-xs font-bold text-[var(--primary)] hover:underline">View Performance Report</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Area Card 2 -->
        <div class="zh-card p-0 overflow-hidden group">
          <div class="flex flex-col md:flex-row">
            
            <!-- Map Preview (Left) -->
            <div class="w-full md:w-64 h-48 md:h-auto bg-[#E5E3DF] relative flex items-center justify-center border-r border-[var(--border-color)]">
              <!-- Mock Map Roads / Texture -->
              <div class="absolute inset-0 opacity-[0.05]" style="background-image: radial-gradient(circle at 2px 2px, black 1px, transparent 0); background-size: 16px 16px;"></div>
              <!-- Radius Visualization -->
              <div class="w-24 h-24 rounded-full border-2 border-[var(--accent)]/40 bg-[var(--accent)]/10 flex items-center justify-center relative z-10">
                <div class="w-3 h-3 bg-[var(--accent)] rounded-full shadow-md"></div>
              </div>
              <div class="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-[9px] font-bold px-2 py-1 rounded shadow text-gray-700">Central Business District</div>
            </div>

            <!-- Details (Right) -->
            <div class="flex-1 p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="font-black text-xl text-[var(--text-main)]">Area B (Central)</h3>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-700">ACTIVE</span>
                  </div>
                  <p class="text-xs text-[var(--text-muted)] font-medium">Covers MG Road, Indiranagar, and Koramangala</p>
                </div>
                <button class="p-2 hover:bg-[var(--bg-surface)] rounded-xl text-[var(--text-muted)] transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                </button>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Assigned Manager</p>
                  <div class="flex items-center gap-2">
                    <img src="https://ui-avatars.com/api/?name=Arjun+V&background=3E7B27&color=fff" class="w-6 h-6 rounded-md object-cover" />
                    <span class="text-xs font-bold text-[var(--text-main)]">Arjun V.</span>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Backup Member</p>
                  <span class="text-xs font-semibold text-rose-500">Unassigned</span>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Service Radius</p>
                  <p class="text-sm font-bold text-[var(--text-main)]">3.5 km</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Current Operations</p>
                  <p class="text-sm font-bold text-[var(--text-main)]">2 Active Requests</p>
                </div>
              </div>

              <div class="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                <button class="text-xs font-bold text-[var(--primary)] hover:underline">Edit Configuration</button>
                <div class="w-1 h-1 rounded-full bg-gray-300"></div>
                <button class="text-xs font-bold text-[var(--primary)] hover:underline">View on Operations Map</button>
                <div class="w-1 h-1 rounded-full bg-gray-300"></div>
                <button class="text-xs font-bold text-[var(--primary)] hover:underline">View Performance Report</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AreaManagementComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
