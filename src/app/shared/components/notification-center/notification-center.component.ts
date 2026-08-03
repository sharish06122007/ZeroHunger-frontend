import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative inline-block text-left">
      <button
        (click)="toggleMenu()"
        type="button"
        class="relative p-2.5 rounded-2xl bg-white/80 border border-[#E8DDD3] text-[#1A1A1A] hover:bg-[#F7EFE5] transition-all shadow-sm flex items-center justify-center"
      >
        <span class="text-xl">🔔</span>
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md animate-pulse">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        }
      </button>

      @if (isOpen()) {
        <div class="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#E8DDD3] shadow-2xl z-50 p-4 space-y-3">
          <div class="flex items-center justify-between border-b border-[#E8DDD3] pb-3">
            <div class="flex items-center gap-2">
              <h3 class="font-extrabold text-sm text-[#1A1A1A]">Notifications</h3>
              <span class="badge badge-primary text-[10px]">{{ unreadCount() }} unread</span>
            </div>
            @if (unreadCount() > 0) {
              <button (click)="markAllRead()" class="text-xs font-semibold text-[#7743DB] hover:underline">
                Mark all read
              </button>
            }
          </div>

          <div class="max-h-80 overflow-y-auto space-y-2 pr-1">
            @for (item of notifications(); track item._id) {
              <div
                (click)="item.isRead ? null : markRead(item._id)"
                class="p-3 rounded-2xl transition-all cursor-pointer border flex items-start gap-3"
                [ngClass]="item.isRead ? 'bg-white border-[#E8DDD3]/50 opacity-75' : 'bg-[#F7EFE5]/80 border-[#7743DB]/30 shadow-sm'"
              >
                <div class="text-lg">
                  @switch (item.type) {
                    @case ('request_approved') { 🎉 }
                    @case ('food_available') { 🍱 }
                    @case ('request_update') { 🚗 }
                    @default { 🔔 }
                  }
                </div>
                <div class="flex-1 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold text-xs text-[#1A1A1A]">{{ item.title }}</h4>
                    <span class="text-[10px] text-[#5B5B6A]">{{ item.createdAt | date:'shortTime' }}</span>
                  </div>
                  <p class="text-[11px] text-[#5B5B6A] leading-snug">{{ item.message }}</p>
                </div>
              </div>
            } @empty {
              <div class="p-6 text-center text-xs text-[#5B5B6A] space-y-1">
                <span class="text-2xl block">✨</span>
                <p class="font-semibold">All caught up!</p>
                <p class="text-[10px]">No new notifications right now.</p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class NotificationCenterComponent {
  private readonly notificationService = inject(NotificationService);

  readonly isOpen = signal(false);
  readonly notifications = this.notificationService.notifications;
  readonly unreadCount = this.notificationService.unreadCount;

  toggleMenu(): void {
    this.isOpen.update(v => !v);
  }

  markRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead();
  }
}
