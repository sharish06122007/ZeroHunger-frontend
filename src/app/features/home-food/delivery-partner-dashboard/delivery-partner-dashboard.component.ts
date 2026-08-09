import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-delivery-partner-dashboard',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('modalFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ])
  ],
  template: `
    <div class="space-y-8 pb-12" @fadeIn>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-4xl font-black text-brand-text tracking-tighter">Delivery Partner Dashboard</h1>
          <p class="text-sm text-brand-textSec mt-1">Accept deliveries, manage routes, and earn while helping the community.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-brand-success/10 text-brand-success rounded-full text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
            Online & Ready
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="zh-card p-6 bg-brand-bgWarm border-brand-borderLight flex items-center justify-between">
          <div>
            <p class="text-xs text-brand-textSec font-bold uppercase tracking-wider mb-1">Today's Earnings</p>
            <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-emerald">₹840</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
        <div class="zh-card p-6 bg-brand-bgWarm border-brand-borderLight flex items-center justify-between">
          <div>
            <p class="text-xs text-brand-textSec font-bold uppercase tracking-wider mb-1">Deliveries Done</p>
            <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-primary">12</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
        </div>
        <div class="zh-card p-6 bg-brand-bgWarm border-brand-borderLight flex items-center justify-between">
          <div>
            <p class="text-xs text-brand-textSec font-bold uppercase tracking-wider mb-1">Distance Covered</p>
            <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-indigo">42 km</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-brand-text mb-6">Available Deliveries</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Mock Delivery Item -->
          <div class="zh-card p-6 flex flex-col group hover:border-brand-primary/30 cursor-pointer">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-gold/10 text-brand-gold">
                  Ready For Pickup
                </span>
                <span class="text-xs font-bold text-brand-textSec">Order #1042</span>
              </div>
              <span class="text-xl font-black text-brand-emerald">₹40 Earn</span>
            </div>

            <h3 class="text-lg font-bold text-brand-text mb-4">5x Vegetarian Meals</h3>
            
            <div class="space-y-4 mb-6 relative">
              <div class="absolute left-[11px] top-4 bottom-4 w-[2px] bg-brand-borderLight -z-10"></div>
              
              <div class="flex items-start gap-4">
                <div class="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-lg mt-0.5">
                  <span class="text-[10px]">A</span>
                </div>
                <div>
                  <span class="block text-[11px] font-bold text-brand-textSec uppercase tracking-wider mb-0.5">Pickup</span>
                  <span class="block font-semibold text-brand-text">123 Maker Street, Block B</span>
                  <span class="block text-xs text-brand-textSec mt-0.5">Distance: 1.2 km</span>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-6 h-6 rounded-full bg-brand-emerald text-white flex items-center justify-center shrink-0 shadow-lg mt-0.5">
                  <span class="text-[10px]">B</span>
                </div>
                <div>
                  <span class="block text-[11px] font-bold text-brand-textSec uppercase tracking-wider mb-0.5">Drop-off</span>
                  <span class="block font-semibold text-brand-text">456 Customer Ave, Apt 12</span>
                  <span class="block text-xs text-brand-textSec mt-0.5">Distance: 3.5 km</span>
                </div>
              </div>
            </div>

            <div class="mt-auto pt-4 border-t border-brand-borderLight flex items-center gap-4">
              <button class="btn-secondary h-12 px-6 flex-1">Decline</button>
              <button (click)="acceptDelivery()" class="btn-primary h-12 flex-[2] shadow-none group-hover:shadow-premium-hover">
                Accept Delivery
              </button>
            </div>
          </div>

          <!-- Mock Delivery Item 2 -->
          <div class="zh-card p-6 flex flex-col group hover:border-brand-primary/30 cursor-pointer">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-textSec/10 text-brand-textSec">
                  Preparing (15m)
                </span>
                <span class="text-xs font-bold text-brand-textSec">Order #1045</span>
              </div>
              <span class="text-xl font-black text-brand-emerald">₹65 Earn</span>
            </div>

            <h3 class="text-lg font-bold text-brand-text mb-4">Family Dinner Box (Non-Veg)</h3>
            
            <div class="space-y-4 mb-6 relative">
              <div class="absolute left-[11px] top-4 bottom-4 w-[2px] bg-brand-borderLight -z-10"></div>
              
              <div class="flex items-start gap-4">
                <div class="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-lg mt-0.5">
                  <span class="text-[10px]">A</span>
                </div>
                <div>
                  <span class="block text-[11px] font-bold text-brand-textSec uppercase tracking-wider mb-0.5">Pickup</span>
                  <span class="block font-semibold text-brand-text">89 Spice Route, Andheri East</span>
                  <span class="block text-xs text-brand-textSec mt-0.5">Distance: 4.0 km</span>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-6 h-6 rounded-full bg-brand-emerald text-white flex items-center justify-center shrink-0 shadow-lg mt-0.5">
                  <span class="text-[10px]">B</span>
                </div>
                <div>
                  <span class="block text-[11px] font-bold text-brand-textSec uppercase tracking-wider mb-0.5">Drop-off</span>
                  <span class="block font-semibold text-brand-text">22 Lake View Heights, Powai</span>
                  <span class="block text-xs text-brand-textSec mt-0.5">Distance: 6.2 km</span>
                </div>
              </div>
            </div>

            <div class="mt-auto pt-4 border-t border-brand-borderLight flex items-center gap-4">
              <button class="btn-secondary h-12 px-6 flex-1">Decline</button>
              <button (click)="acceptDelivery()" class="btn-primary h-12 flex-[2] shadow-none group-hover:shadow-premium-hover">
                Accept Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Accept Delivery Success Modal -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          
          <div class="fixed inset-0 bg-brand-darker/60 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>
          
          <div @modalFade class="relative bg-brand-bg rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-brand-borderLight text-center overflow-hidden z-10">
            <!-- Decorative blur -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-brand-emerald/10 rounded-full blur-[40px] -z-10"></div>

            <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-brand-emerald/10 text-brand-emerald mb-6">
              <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 class="text-2xl font-black text-brand-text mb-2">Delivery Accepted!</h3>
            <p class="text-sm text-brand-textSec mb-8 leading-relaxed">
              Please proceed to the pickup location. The restaurant and customer have been notified of your arrival.
            </p>
            
            <button type="button" (click)="closeModal()" class="w-full btn-primary h-14 text-lg shadow-premium">
              Proceed to Pickup
            </button>
          </div>
        </div>
      }
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
