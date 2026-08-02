// core/services/toast.service.ts
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  private add(type: ToastType, title: string, message?: string, duration = 4000): void {
    const id = Math.random().toString(36).slice(2);
    this.toasts.update(ts => [...ts, { id, type, title, message }]);
    setTimeout(() => this.remove(id), duration);
  }

  success(title: string, message?: string): void { this.add('success', title, message); }
  error(title: string, message?: string): void    { this.add('error', title, message); }
  warning(title: string, message?: string): void  { this.add('warning', title, message); }
  info(title: string, message?: string): void     { this.add('info', title, message); }

  remove(id: string): void {
    this.toasts.update(ts => ts.filter(t => t.id !== id));
  }
}
