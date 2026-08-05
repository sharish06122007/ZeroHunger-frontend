import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maker-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Food Maker Dashboard</h1>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Nearby Food Requests</h3>
            <p class="mt-1 text-sm text-gray-500">Accept requests to start preparing food.</p>
          </div>
          
          <ul class="divide-y divide-gray-200">
            <li *ngIf="requests.length === 0" class="px-6 py-12 text-center text-gray-500">
              No pending requests in your area right now.
            </li>
            
            <li *ngFor="let req of requests" class="px-6 py-5 hover:bg-gray-50 transition duration-150">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      [ngClass]="{'bg-blue-100 text-blue-800': req.foodCategory === 'Lunch', 'bg-purple-100 text-purple-800': req.foodCategory === 'Dinner', 'bg-orange-100 text-orange-800': req.foodCategory === 'Breakfast', 'bg-green-100 text-green-800': true}">
                      {{ req.foodCategory }}
                    </span>
                    <p class="text-sm font-medium text-gray-900 truncate">{{ req.foodItemName }}</p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:space-x-6">
                    <div class="flex items-center">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {{ req.numberOfPeople }} People
                    </div>
                    <div class="flex items-center mt-2 sm:mt-0">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      Due: {{ req.requiredDeliveryTime | date:'shortTime' }}
                    </div>
                    <div class="flex items-center mt-2 sm:mt-0 font-medium text-emerald-600">
                      Budget: {{ req.budgetRange }}
                    </div>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <button (click)="acceptRequest(req._id)" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition">
                    Accept Request
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
export class MakerDashboardComponent implements OnInit {
  requests: any[] = [];

  constructor(
    private homeFoodService: HomeFoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchRequests();
  }

  fetchRequests() {
    this.homeFoodService.getNearbyRequests().subscribe({
      next: (res) => {
        this.requests = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  acceptRequest(id: string) {
    this.homeFoodService.acceptRequest(id).subscribe({
      next: (res) => {
        alert('Request accepted successfully! Navigating to order details (Not fully implemented yet).');
        this.fetchRequests();
        // this.router.navigate(['/dashboard/home-food/order', res.data._id]);
      },
      error: (err) => console.error(err)
    });
  }
}
