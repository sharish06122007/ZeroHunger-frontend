import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zh-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="getCardClasses()"
      class="bg-brand-card rounded-2xl border border-brand-border transition-all duration-300"
    >
      <div *ngIf="headerVisible" class="p-5 border-b border-brand-border/50">
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div [ngClass]="noPadding ? '' : 'p-5'">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footerVisible" class="p-5 bg-brand-veryLight/30 rounded-b-2xl border-t border-brand-border/50">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class ZhCardComponent {
  @Input() hoverLift: boolean = false;
  @Input() glassmorphism: boolean = false;
  @Input() noPadding: boolean = false;
  @Input() headerVisible: boolean = false;
  @Input() footerVisible: boolean = false;

  getCardClasses(): string {
    let classes = 'shadow-subtle';

    if (this.hoverLift) {
      classes += ' hover:-translate-y-1 hover:shadow-premium';
    }

    if (this.glassmorphism) {
      classes += ' bg-white/80 backdrop-blur-md border-white/20';
    }

    return classes;
  }
}
