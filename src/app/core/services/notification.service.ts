import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { ToastService } from './toast.service';

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly api = inject(ApiService);
  private readonly socket = inject(SocketService);
  private readonly toast = inject(ToastService);

  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = signal<number>(0);

  constructor() {
    this.fetchNotifications();
    this.listenToSocket();
  }

  fetchNotifications(): void {
    this.api.get<any>('notifications').subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data) {
          this.notifications.set(data.notifications || []);
          this.unreadCount.set(data.unreadCount || 0);
        }
      },
      error: () => {},
    });
  }

  private listenToSocket(): void {
    this.socket.onEvent('notification:new').subscribe((notif: AppNotification) => {
      this.notifications.update((list) => [notif, ...list]);
      this.unreadCount.update((count) => count + 1);
      this.toast.info(notif.title, notif.message);
    });
  }

  markAsRead(id: string): void {
    this.api.patch(`notifications/${id}/read`, {}).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        this.unreadCount.update((count) => Math.max(0, count - 1));
      },
    });
  }

  markAllAsRead(): void {
    this.api.patch('notifications/read-all', {}).subscribe({
      next: () => {
        this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
        this.unreadCount.set(0);
      },
    });
  }
}
