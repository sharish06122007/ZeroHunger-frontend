import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operations-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[var(--text-main)] mb-1">Operations Map</h1>
          <p class="text-sm text-[var(--text-muted)] font-medium">Live visualization of requests, donations, and team areas.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 rounded-xl bg-white text-[var(--text-main)] border border-[var(--border-color)] text-xs font-bold hover:border-[var(--primary)] transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filter By Status
          </button>
          <button class="btn-primary flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refresh Map
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-4 gap-4">
        <div class="zh-card p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-black text-[var(--text-main)]">12</p>
            <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Areas</p>
          </div>
        </div>
        <div class="zh-card p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-black text-[var(--text-main)]">8</p>
            <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Urgent Requests</p>
          </div>
        </div>
        <div class="zh-card p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-black text-[var(--text-main)]">24</p>
            <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">In Progress</p>
          </div>
        </div>
        <div class="zh-card p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-black text-[var(--text-main)]">18</p>
            <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Members</p>
          </div>
        </div>
      </div>

      <!-- Main Map Container -->
      <div class="zh-card p-1 flex-1 min-h-[600px] flex overflow-hidden relative group">
        <!-- Sidebar Panel -->
        <div class="w-80 border-r border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col h-full z-10">
          <div class="p-4 border-b border-[var(--border-color)]">
            <h3 class="font-bold text-sm text-[var(--text-main)] mb-3">Live Feed</h3>
            
            <div class="flex gap-2">
              <button class="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-[10px] font-bold">All</button>
              <button class="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] text-[10px] font-bold hover:bg-white hover:text-[var(--primary)] transition-all">Requests</button>
              <button class="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] text-[10px] font-bold hover:bg-white hover:text-[var(--primary)] transition-all">Donations</button>
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <!-- Feed Item -->
            <div class="p-3 rounded-xl border border-[var(--border-color)] bg-white hover:border-[var(--primary)]/50 hover:shadow-md transition-all cursor-pointer">
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-700">URGENT</span>
                <span class="text-[10px] font-semibold text-[var(--text-muted)]">2m ago</span>
              </div>
              <h4 class="font-bold text-xs text-[var(--text-main)] mb-1">Food Request #REQ-842</h4>
              <p class="text-[11px] text-[var(--text-muted)] mb-3 line-clamp-1">Requires 50 meals at Community Center</p>
              
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-md bg-[var(--primary)] text-white flex items-center justify-center text-[8px] font-bold">TM</div>
                  <span class="text-[10px] font-semibold text-[var(--text-main)]">Area B</span>
                </div>
                <button class="text-[10px] font-bold text-[var(--primary)]">Locate</button>
              </div>
            </div>

            <!-- Feed Item -->
            <div class="p-3 rounded-xl border border-[var(--border-color)] bg-white hover:border-[var(--primary)]/50 hover:shadow-md transition-all cursor-pointer">
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--primary)]/10 text-[var(--primary)]">DONATION</span>
                <span class="text-[10px] font-semibold text-[var(--text-muted)]">15m ago</span>
              </div>
              <h4 class="font-bold text-xs text-[var(--text-main)] mb-1">Surplus from Grand Hotel</h4>
              <p class="text-[11px] text-[var(--text-muted)] mb-3 line-clamp-1">120 portions, expires in 4 hrs</p>
              
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-md bg-[var(--accent)] text-white flex items-center justify-center text-[8px] font-bold">JD</div>
                  <span class="text-[10px] font-semibold text-[var(--text-main)]">Area A (Assigned)</span>
                </div>
                <button class="text-[10px] font-bold text-[var(--primary)]">Locate</button>
              </div>
            </div>
            
            <!-- Feed Item -->
            <div class="p-3 rounded-xl border border-[var(--border-color)] bg-white hover:border-[var(--primary)]/50 hover:shadow-md transition-all cursor-pointer">
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">NGO REQUEST</span>
                <span class="text-[10px] font-semibold text-[var(--text-muted)]">1h ago</span>
              </div>
              <h4 class="font-bold text-xs text-[var(--text-main)] mb-1">Asha Foundation Event</h4>
              <p class="text-[11px] text-[var(--text-muted)] mb-3 line-clamp-1">Scheduled for tomorrow 10 AM</p>
              
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-md bg-gray-200 text-gray-500 flex items-center justify-center text-[8px] font-bold">--</div>
                  <span class="text-[10px] font-semibold text-rose-500">Unassigned</span>
                </div>
                <button class="text-[10px] font-bold text-[var(--primary)]">Locate</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Fake Map View (Since we lack API Key at the moment) -->
        <!-- In a real deployment, this is where <google-map> will sit -->
        <div class="flex-1 bg-[#E5E3DF] relative flex flex-col items-center justify-center overflow-hidden">
          
          <!-- Mock Map Roads / Texture -->
          <div class="absolute inset-0 opacity-[0.05]" style="background-image: radial-gradient(circle at 2px 2px, black 1px, transparent 0); background-size: 24px 24px;"></div>
          
          <!-- Mock Map UI Controls -->
          <div class="absolute top-4 right-4 flex flex-col gap-2 shadow-lg">
            <button class="w-8 h-8 bg-white flex items-center justify-center rounded-t border-b border-gray-100 text-gray-600 hover:text-black hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </button>
            <button class="w-8 h-8 bg-white flex items-center justify-center rounded-b text-gray-600 hover:text-black hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
            </button>
          </div>

          <!-- Mock Map Layers Control -->
          <div class="absolute top-4 left-4 flex gap-2">
            <button class="px-3 py-1.5 bg-white shadow-md rounded-lg text-[10px] font-bold text-[var(--primary)] border border-[var(--primary)] flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-[var(--primary)]"></div> Team Members
            </button>
            <button class="px-3 py-1.5 bg-white shadow-md rounded-lg text-[10px] font-bold text-gray-600 flex items-center gap-1.5 hover:text-black">
              <div class="w-2 h-2 rounded-full border-2 border-orange-500 border-dashed"></div> Areas
            </button>
          </div>
          
          <!-- "Waiting for Map" Placeholder Message -->
          <div class="z-20 flex flex-col items-center text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-sm border border-white">
            <div class="w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-4 shadow-inner">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            </div>
            <h3 class="text-lg font-extrabold text-[var(--text-main)] mb-2">Google Maps Pending</h3>
            <p class="text-xs text-[var(--text-muted)] font-medium leading-relaxed mb-4">The map integration requires a valid Google Maps API Key in the <code class="bg-gray-100 px-1 rounded text-gray-800">.env</code> file. Once provided, the live area and radius visualizations will render here.</p>
            <button class="btn-primary w-full shadow-lg shadow-[var(--primary)]/20">Configure API Key</button>
          </div>
          
          <!-- Decorative Area Circles on the background to make it look active -->
          <div class="absolute left-1/4 top-1/3 w-64 h-64 rounded-full border-2 border-[var(--primary)]/30 bg-[var(--primary)]/5"></div>
          <div class="absolute right-1/3 bottom-1/4 w-48 h-48 rounded-full border-2 border-[var(--accent)]/30 bg-[var(--accent)]/5"></div>
          <div class="absolute left-1/2 top-1/2 w-80 h-80 rounded-full border-2 border-orange-500/20 bg-orange-500/5 -translate-x-1/2 -translate-y-1/2"></div>
          
          <!-- Fake Map Pins -->
          <div class="absolute left-1/4 top-1/3 w-6 h-6 bg-[var(--primary)] rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute right-1/3 bottom-1/4 w-6 h-6 bg-[var(--accent)] rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute left-[45%] top-[55%] w-6 h-6 bg-rose-500 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class OperationsMapComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
