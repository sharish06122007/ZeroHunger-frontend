import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';

@Component({
  selector: 'app-delivery-partner-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[var(--bg-main)] min-h-screen p-6 sm:p-12 space-y-8" @fadeInUp>
      <div class="max-w-7xl mx-auto space-y-6">
        <h1 class="text-3xl font-extrabold text-[var(--text-main)] tracking-tight mb-8">Delivery Partner Dashboard</h1>
        
        <div class="zh-card p-0 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl overflow-hidden">
          <div class="px-6 py-5 border-b border-[var(--border-color)] bg-[var(--bg-main)] flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-extrabold text-[var(--text-main)]">Available Deliveries</h3>
              <p class="mt-1 text-xs text-[var(--text-muted)]">Accept and manage your delivery tasks.</p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>
          
          <ul class="divide-y divide-[var(--border-color)]">
            <!-- Mock Delivery Item -->
            <li class="px-6 py-5 hover:bg-[var(--bg-main)]/50 transition duration-150">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Pending Pickup
                    </span>
                    <p class="text-sm font-bold text-[var(--text-main)] truncate">Order #1042 - 5x Vegetarian Meals</p>
                  </div>
                  
                  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-start space-x-2 text-xs text-[var(--text-muted)]">
                      <svg class="h-4 w-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <span class="block font-bold text-[var(--text-main)]">Pickup Location</span>
                        <span class="block">123 Maker Street, Block B</span>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-2 text-xs text-[var(--text-muted)]">
                      <svg class="h-4 w-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <span class="block font-bold text-[var(--text-main)]">Delivery Location</span>
                        <span class="block">456 Customer Ave, Apt 12</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-end">
                  <div class="text-lg font-bold text-[var(--success)] mb-2">₹40 Earn</div>
                  <button (click)="acceptDelivery()" class="btn-primary py-2 px-4 text-xs font-bold">
                    Accept Delivery
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Accept Delivery Success Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          
          <div class="fixed inset-0 bg-[var(--dark)] bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" (click)="closeModal()"></div>
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div class="inline-block align-bottom zh-card px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 border-[var(--border-color)]">
            <div>
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100">
                <svg class="h-8 w-8 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="mt-4 text-center sm:mt-5">
                <h3 class="text-xl leading-6 font-extrabold text-[var(--text-main)]" id="modal-title">Delivery Accepted!</h3>
                <div class="mt-3">
                  <p class="text-xs text-[var(--text-muted)]">Please proceed to the pickup location. The restaurant and customer have been notified of your arrival.</p>
                </div>
              </div>
            </div>
            <div class="mt-6 sm:mt-6">
              <button type="button" (click)="closeModal()" class="btn-primary w-full py-3 text-sm">
                Proceed to Pickup
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `
})
export class DeliveryPartnerDashboardComponent implements OnInit {
  showModal = false;

  constructor(private homeFoodService: HomeFoodService) {}

  ngOnInit() {
    // In a real app, we would fetch available deliveries via Socket or API
  }
  
  acceptDelivery() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
