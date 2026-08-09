import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFoodService } from '../services/home-food.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maker-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[var(--bg-main)] min-h-screen p-6 sm:p-12 space-y-8" @fadeInUp>
      <div class="max-w-7xl mx-auto space-y-6">
        <h1 class="text-3xl font-extrabold text-[var(--text-main)] tracking-tight mb-8">Food Maker Dashboard</h1>
        
        <div class="zh-card p-0 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl overflow-hidden">
          <div class="px-6 py-5 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
            <h3 class="text-lg leading-6 font-extrabold text-[var(--text-main)]">Nearby Food Requests</h3>
            <p class="mt-1 text-xs text-[var(--text-muted)]">Accept requests to start preparing food.</p>
          </div>
          
          <ul class="divide-y divide-[var(--border-color)]">
            <li *ngIf="requests.length === 0" class="px-6 py-12 text-center text-xs text-[var(--text-muted)] font-medium">
              No pending requests in your area right now.
            </li>
            
            <li *ngFor="let req of requests" class="px-6 py-5 hover:bg-[var(--bg-main)]/50 transition duration-150">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" 
                      [ngClass]="{'bg-blue-100 text-blue-800': req.foodCategory === 'Lunch', 'bg-purple-100 text-purple-800': req.foodCategory === 'Dinner', 'bg-orange-100 text-orange-800': req.foodCategory === 'Breakfast', 'bg-emerald-100 text-emerald-800': true}">
                      {{ req.foodCategory }}
                    </span>
                    <p class="text-sm font-bold text-[var(--text-main)] truncate">{{ req.foodItemName }}</p>
                  </div>
                  <div class="mt-2 flex items-center text-xs text-[var(--text-muted)] sm:space-x-6">
                    <div class="flex items-center">
                      <svg class="flex-shrink-0 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {{ req.numberOfPeople }} People
                    </div>
                    <div class="flex items-center mt-2 sm:mt-0">
                      <svg class="flex-shrink-0 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      Due: {{ req.requiredDeliveryTime | date:'shortTime' }}
                    </div>
                    <div class="flex items-center mt-2 sm:mt-0 font-bold text-[var(--success)]">
                      Budget: {{ req.budgetRange }}
                    </div>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <button (click)="acceptRequest(req._id)" class="btn-primary py-2 px-4 text-xs font-bold">
                    Accept Request
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
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
