import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

@Component({
  selector: 'app-zh-badge',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span 
      [ngClass]="getBadgeClasses()"
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
    >
      <lucide-icon *ngIf="icon" [name]="icon" class="w-3.5 h-3.5"></lucide-icon>
      <ng-content></ng-content>
    </span>
  `,
  styles: []
})
export class ZhBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() icon: string = '';

  getBadgeClasses(): string {
    switch (this.variant) {
      case 'success':
        return 'bg-brand-primary-very-light text-brand-primary-dark border border-brand-primary-light/50';
      case 'warning':
        return 'bg-brand-accent-soft text-brand-accent-warm border border-brand-accent/30';
      case 'error':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }
}
