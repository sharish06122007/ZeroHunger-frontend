import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-6">
      <h3 class="text-xl font-bold text-brand-text mb-8">Order Status</h3>
      <div class="relative pl-4">
        <!-- Vertical line -->
        <div class="absolute top-0 bottom-0 left-8 w-[2px] bg-brand-borderLight -z-10" aria-hidden="true"></div>
        
        <ul class="relative space-y-8">
          @for (step of steps; track step.id; let i = $index) {
            <li class="relative">
              <div class="flex items-start">
                <div class="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 shadow-sm mt-1"
                     [ngClass]="getStepIconClass(i)">
                  <!-- Check Icon for completed -->
                  @if (i < currentStepIndex) {
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  }
                  <!-- Dot for current/pending -->
                  @if (i >= currentStepIndex) {
                    <span class="w-3 h-3 rounded-full"
                          [ngClass]="i === currentStepIndex ? 'bg-brand-primary' : 'bg-transparent'"></span>
                  }
                </div>
                <div class="ml-6 min-w-0 flex-1 bg-brand-bgWarm/50 p-4 rounded-2xl border border-brand-borderLight transition-all"
                     [ngClass]="i === currentStepIndex ? 'border-brand-primary/50 shadow-sm' : ''">
                  <p class="text-base font-bold transition-colors duration-300"
                     [ngClass]="i <= currentStepIndex ? 'text-brand-text' : 'text-brand-textSec'">
                    {{ step.label }}
                  </p>
                  <p class="text-sm mt-1" [ngClass]="i <= currentStepIndex ? 'text-brand-textSec' : 'text-brand-textSec/60'">
                    {{ step.description }}
                  </p>
                </div>
              </div>
            </li>
          }
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
    const idx = this.steps.findIndex(s => s.id === this.currentStatus);
    return idx === -1 ? 0 : idx;
  }

  getStepIconClass(index: number): string {
    if (index < this.currentStepIndex) {
      return 'bg-brand-primary border-4 border-white';
    } else if (index === this.currentStepIndex) {
      return 'bg-white border-4 border-brand-primary ring-2 ring-brand-primary/20 ring-offset-2';
    } else {
      return 'bg-brand-bgWarm border-4 border-white ring-1 ring-brand-borderLight';
    }
  }
}
