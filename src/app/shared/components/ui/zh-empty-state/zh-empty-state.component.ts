import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ZhButtonComponent } from '../zh-button/zh-button.component';

@Component({
  selector: 'app-zh-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ZhButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center min-h-[300px] w-full rounded-2xl bg-brand-white border border-brand-border border-dashed">
      <div class="w-20 h-20 bg-brand-primary-very-light rounded-full flex items-center justify-center mb-6 text-brand-primary">
        <lucide-icon [name]="icon" class="w-10 h-10"></lucide-icon>
      </div>
      
      <h3 class="text-xl font-bold text-brand-text mb-2">{{ title }}</h3>
      <p class="text-brand-muted max-w-sm mb-6">{{ description }}</p>
      
      <app-zh-button 
        *ngIf="actionLabel" 
        variant="primary" 
        (onClick)="onAction.emit($event)"
      >
        <lucide-icon *ngIf="actionIcon" [name]="actionIcon" class="w-4 h-4"></lucide-icon>
        {{ actionLabel }}
      </app-zh-button>
    </div>
  `,
  styles: []
})
export class ZhEmptyStateComponent {
  @Input() icon: string = 'box';
  @Input() title: string = 'No Data Available';
  @Input() description: string = 'There is nothing to show here at the moment.';
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = '';
  
  @Output() onAction = new EventEmitter<Event>();
}
