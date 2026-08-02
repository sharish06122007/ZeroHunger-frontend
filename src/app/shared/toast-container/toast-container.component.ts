import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xl transition-all transform ease-out duration-300 animate-slide-in"
          [ngClass]="{
            'bg-white/90 border-emerald-200 text-emerald-950': toast.type === 'success',
            'bg-white/90 border-rose-200 text-rose-950': toast.type === 'error',
            'bg-white/90 border-amber-200 text-amber-950': toast.type === 'warning',
            'bg-white/90 border-purple-200 text-purple-950': toast.type === 'info'
          }"
        >
          <div class="mt-0.5 p-1.5 rounded-xl text-white font-bold"
               [ngClass]="{
                 'bg-emerald-500': toast.type === 'success',
                 'bg-rose-500': toast.type === 'error',
                 'bg-amber-500': toast.type === 'warning',
                 'bg-[#7743DB]': toast.type === 'info'
               }">
            @if (toast.type === 'success') {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            } @else if (toast.type === 'error') {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            } @else if (toast.type === 'warning') {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            } @else {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            }
          </div>

          <div class="flex-1">
            <h4 class="font-semibold text-sm leading-tight text-[#1A1A1A]">{{ toast.title }}</h4>
            @if (toast.message) {
              <p class="text-xs text-[#5B5B6A] mt-1">{{ toast.message }}</p>
            }
          </div>

          <button
            (click)="toastService.remove(toast.id)"
            class="text-[#5B5B6A] hover:text-[#1A1A1A] transition-colors p-1"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-12px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-in {
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
