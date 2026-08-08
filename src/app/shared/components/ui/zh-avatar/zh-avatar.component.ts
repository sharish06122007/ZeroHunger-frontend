import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-zh-avatar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div 
      [ngClass]="getAvatarClasses()"
      class="relative rounded-full overflow-hidden flex items-center justify-center bg-brand-primary-very-light border border-brand-primary-light flex-shrink-0"
    >
      <img *ngIf="src && !imgError" [src]="src" [alt]="name" (error)="onImgError()" class="w-full h-full object-cover" />
      <span *ngIf="(!src || imgError) && initials" class="font-semibold text-brand-primary-dark">
        {{ initials }}
      </span>
      <lucide-icon *ngIf="(!src || imgError) && !initials" name="user" class="text-brand-primary-light" [ngClass]="getIconClasses()"></lucide-icon>
      
      <!-- Verification Badge -->
      <div *ngIf="verified" class="absolute bottom-0 right-0 bg-brand-primary text-white rounded-full p-0.5 border-2 border-white" title="Verified">
        <lucide-icon name="badge-check" class="w-3 h-3"></lucide-icon>
      </div>
    </div>
  `,
  styles: []
})
export class ZhAvatarComponent implements OnInit {
  @Input() src: string = '';
  @Input() name: string = '';
  @Input() size: AvatarSize = 'md';
  @Input() verified: boolean = false;

  initials: string = '';
  imgError: boolean = false;

  ngOnInit() {
    this.generateInitials();
  }

  generateInitials() {
    if (this.name) {
      const parts = this.name.split(' ');
      if (parts.length >= 2) {
        this.initials = (parts[0][0] + parts[1][0]).toUpperCase();
      } else {
        this.initials = (parts[0][0] + (parts[0][1] || '')).toUpperCase();
      }
    }
  }

  onImgError() {
    this.imgError = true;
  }

  getAvatarClasses(): string {
    switch (this.size) {
      case 'sm': return 'w-8 h-8 text-xs';
      case 'md': return 'w-10 h-10 text-sm';
      case 'lg': return 'w-14 h-14 text-base';
      case 'xl': return 'w-20 h-20 text-xl';
      default: return 'w-10 h-10 text-sm';
    }
  }

  getIconClasses(): string {
    switch (this.size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-5 h-5';
      case 'lg': return 'w-7 h-7';
      case 'xl': return 'w-10 h-10';
      default: return 'w-5 h-5';
    }
  }
}
