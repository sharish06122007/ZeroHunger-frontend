import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">Order Status</h3>
      <div class="relative">
        <!-- Vertical line -->
        <div class="absolute inset-0 flex items-center justify-center w-8 h-full" aria-hidden="true">
          <div class="w-0.5 h-full bg-gray-200"></div>
        </div>
        
        <ul class="relative space-y-6">
          <li *ngFor="let step of steps; let i = index" class="relative">
            <div class="flex items-center">
              <div class="relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-300"
                   [ngClass]="getStepIconClass(i)">
                <!-- Check Icon for completed -->
                <svg *ngIf="i < currentStepIndex" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <!-- Dot for current/pending -->
                <span *ngIf="i >= currentStepIndex" class="w-2.5 h-2.5 rounded-full"
                      [ngClass]="i === currentStepIndex ? 'bg-emerald-600' : 'bg-transparent'"></span>
              </div>
              <div class="ml-4 min-w-0 flex-1">
                <p class="text-sm font-medium transition-colors duration-300"
                   [ngClass]="i <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'">
                  {{ step.label }}
                </p>
                <p class="text-sm text-gray-500">{{ step.description }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class OrderStatusTimelineComponent {
  @Input() currentStatus: string = 'pending';

  steps = [
    { id: 'pending', label: 'Order Placed', description: 'Request sent to nearby makers' },
    { id: 'accepted', label: 'Accepted', description: 'Maker has accepted your request' },
    { id: 'preparing', label: 'Preparing', description: 'Your food is being prepared' },
    { id: 'ready', label: 'Food Ready', description: 'Waiting for delivery partner' },
    { id: 'out_for_delivery', label: 'Out for Delivery', description: 'Delivery partner is on the way' },
    { id: 'delivered', label: 'Delivered', description: 'Order completed' }
  ];

  get currentStepIndex(): number {
    return this.steps.findIndex(s => s.id === this.currentStatus);
  }

  getStepIconClass(index: number): string {
    if (index < this.currentStepIndex) {
      return 'bg-emerald-500 border-2 border-emerald-500 ring-4 ring-white';
    } else if (index === this.currentStepIndex) {
      return 'bg-white border-2 border-emerald-600 ring-4 ring-white';
    } else {
      return 'bg-white border-2 border-gray-300 ring-4 ring-white';
    }
  }
}
