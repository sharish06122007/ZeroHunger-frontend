import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Loader2 } from 'lucide-angular';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-zh-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      [ngClass]="getButtonClasses()"
      class="inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <lucide-icon *ngIf="loading" name="loader-2" class="animate-spin w-4 h-4"></lucide-icon>
      <ng-content *ngIf="!loading"></ng-content>
      <ng-content select="[icon]"></ng-content>
    </button>
  `,
  styles: []
})
export class ZhButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  
  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    let classes = '';

    // Size
    switch (this.size) {
      case 'sm': classes += ' px-3 py-1.5 text-sm rounded-lg'; break;
      case 'md': classes += ' px-6 py-2.5 text-base rounded-xl'; break;
      case 'lg': classes += ' px-8 py-3.5 text-lg rounded-2xl'; break;
    }

    // Full Width
    if (this.fullWidth) {
      classes += ' w-full';
    }

    // Variant
    switch (this.variant) {
      case 'primary':
        classes += ' bg-brand-primary text-white hover:bg-brand-primary-hover shadow-soft hover:shadow-premium hover:-translate-y-0.5';
        break;
      case 'secondary':
        classes += ' bg-brand-accent text-white hover:bg-brand-accentWarm shadow-soft hover:shadow-premium hover:-translate-y-0.5';
        break;
      case 'outline':
        classes += ' bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5';
        break;
      case 'ghost':
        classes += ' bg-transparent text-brand-text hover:bg-brand-primary/10';
        break;
    }

    return classes;
  }
}
