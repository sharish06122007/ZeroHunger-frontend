import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-zh-input',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZhInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full mb-4">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-brand-text mb-1">
        {{ label }} <span *ngIf="required" class="text-red-500">*</span>
      </label>
      
      <div class="relative flex items-center">
        <div *ngIf="icon" class="absolute left-3 text-brand-muted flex items-center pointer-events-none">
          <lucide-icon [name]="icon" class="w-5 h-5"></lucide-icon>
        </div>
        
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onTouched()"
          [ngClass]="getInputClasses()"
          class="w-full bg-brand-bg border border-brand-border text-brand-text text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary block p-3 transition-colors duration-200"
        />
      </div>
      
      <p *ngIf="error" class="mt-1 text-sm text-red-500 flex items-center gap-1">
        <lucide-icon name="alert-circle" class="w-4 h-4"></lucide-icon>
        {{ error }}
      </p>
    </div>
  `,
  styles: []
})
export class ZhInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() icon: string = '';
  @Input() id: string = `zh-input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() disabled: boolean = false;

  value: string = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  getInputClasses(): string {
    let classes = '';
    if (this.icon) {
      classes += ' pl-10'; // Space for icon
    }
    if (this.error) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500/20';
    }
    if (this.disabled) {
      classes += ' opacity-50 cursor-not-allowed bg-brand-border/30';
    }
    return classes;
  }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
