import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zh-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [ngClass]="getSkeletonClasses()"
      class="animate-pulse bg-brand-border/40 rounded-xl"
      [style.width]="width"
      [style.height]="height"
    ></div>
  `,
  styles: []
})
export class ZhSkeletonComponent {
  @Input() type: 'text' | 'circular' | 'rectangular' = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '20px';

  getSkeletonClasses(): string {
    switch (this.type) {
      case 'text': return 'rounded-md mb-2';
      case 'circular': return 'rounded-full';
      case 'rectangular': return 'rounded-xl';
      default: return 'rounded-md';
    }
  }
}
