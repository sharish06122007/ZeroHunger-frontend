import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export interface SelectOption {
  label: string;
  value: any;
  icon?: string;
}

@Component({
  selector: 'app-zh-select',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZhSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full mb-4" (click)="toggleDropdown($event)">
      <label *ngIf="label" class="block text-sm font-medium text-brand-text mb-1">
        {{ label }} <span *ngIf="required" class="text-red-500">*</span>
      </label>
      
      <div 
        [ngClass]="getSelectClasses()"
        class="relative w-full bg-brand-bg border border-brand-border text-brand-text text-sm rounded-xl p-3 cursor-pointer flex justify-between items-center transition-colors duration-200 focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary"
      >
        <div class="flex items-center gap-2">
          <lucide-icon *ngIf="selectedOption?.icon" [name]="selectedOption?.icon!" class="w-5 h-5 text-brand-muted"></lucide-icon>
          <span [class.text-brand-muted]="!selectedOption">{{ selectedOption ? selectedOption.label : placeholder }}</span>
        </div>
        <lucide-icon name="chevron-down" class="w-5 h-5 text-brand-muted transition-transform duration-200" [class.rotate-180]="isOpen"></lucide-icon>
      </div>
      
      <!-- Dropdown -->
      <div *ngIf="isOpen" class="absolute z-50 w-full mt-1 bg-white border border-brand-border rounded-xl shadow-premium max-h-60 overflow-y-auto animate-fade-in-up">
        <div 
          *ngFor="let option of options" 
          (click)="selectOption(option, $event)"
          class="flex items-center gap-2 px-4 py-3 hover:bg-brand-bg cursor-pointer transition-colors"
          [class.bg-brand-primary-very-light]="value === option.value"
          [class.text-brand-primary]="value === option.value"
        >
          <lucide-icon *ngIf="option.icon" [name]="option.icon" class="w-5 h-5" [class.text-brand-primary]="value === option.value" [class.text-brand-muted]="value !== option.value"></lucide-icon>
          <span>{{ option.label }}</span>
        </div>
        <div *ngIf="options.length === 0" class="px-4 py-3 text-brand-muted text-sm text-center">
          No options available
        </div>
      </div>
      
      <p *ngIf="error" class="mt-1 text-sm text-red-500 flex items-center gap-1">
        <lucide-icon name="alert-circle" class="w-4 h-4"></lucide-icon>
        {{ error }}
      </p>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.2s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ZhSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: SelectOption[] = [];
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() disabled: boolean = false;
  
  @Output() selectionChange = new EventEmitter<any>();

  value: any = null;
  isOpen: boolean = false;
  selectedOption: SelectOption | null = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  getSelectClasses(): string {
    let classes = '';
    if (this.error) {
      classes += ' border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20';
    }
    if (this.disabled) {
      classes += ' opacity-50 cursor-not-allowed bg-brand-border/30';
    }
    return classes;
  }

  toggleDropdown(event: Event) {
    if (this.disabled) return;
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onTouched();
      // Add global click listener to close dropdown
      setTimeout(() => {
        const closeDropdown = (e: Event) => {
          this.isOpen = false;
          document.removeEventListener('click', closeDropdown);
        };
        document.addEventListener('click', closeDropdown);
      });
    }
  }

  selectOption(option: SelectOption, event: Event) {
    event.stopPropagation();
    this.value = option.value;
    this.selectedOption = option;
    this.isOpen = false;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
    this.selectedOption = this.options.find(o => o.value === value) || null;
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
