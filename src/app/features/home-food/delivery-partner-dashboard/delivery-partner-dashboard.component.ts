import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';

@Component({
  selector: 'app-delivery-partner-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Delivery Partner Dashboard</h1>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Available Deliveries</h3>
              <p class="mt-1 text-sm text-gray-500">Accept and manage your delivery tasks.</p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>
          
          <ul class="divide-y divide-gray-200">
            <!-- Mock Delivery Item -->
            <li class="px-6 py-5 hover:bg-gray-50 transition duration-150">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Pending Pickup
                    </span>
                    <p class="text-sm font-medium text-gray-900 truncate">Order #1042 - 5x Vegetarian Meals</p>
                  </div>
                  
                  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-start space-x-2 text-sm text-gray-500">
                      <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <span class="block font-medium text-gray-700">Pickup Location</span>
                        <span class="block">123 Maker Street, Block B</span>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-2 text-sm text-gray-500">
                      <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <span class="block font-medium text-gray-700">Delivery Location</span>
                        <span class="block">456 Customer Ave, Apt 12</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-end">
                  <div class="text-lg font-bold text-emerald-600 mb-2">₹40 Earn</div>
                  <button (click)="acceptDelivery()" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition">
                    Accept Delivery
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class DeliveryPartnerDashboardComponent implements OnInit {
  constructor(private homeFoodService: HomeFoodService) {}

  ngOnInit() {
    // In a real app, we would fetch available deliveries via Socket or API
  }
  
  acceptDelivery() {
    alert("Delivery Accepted! Proceed to pickup location.");
  }
}
