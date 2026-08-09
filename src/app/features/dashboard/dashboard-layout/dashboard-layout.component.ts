import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationCenterComponent } from '../../../shared/components/notification-center/notification-center.component';
import { animate, style, transition, trigger } from '@angular/animations';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: string[];
  badge?: number;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationCenterComponent],
  animations: [
    trigger('dropdown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px) scale(0.96)' }),
        animate('200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(-8px) scale(0.96)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen flex bg-brand-bg">
      <!-- Floating Rounded Collapsible Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-out p-4"
        [ngClass]="sidebarCollapsed() ? 'w-24' : 'w-72'"
      >
        <div class="h-full bg-brand-nav text-white rounded-[32px] p-4 flex flex-col justify-between shadow-premium relative overflow-hidden backdrop-blur-xl border border-white/5">
          <!-- Background Subtle Gradient Overlay -->
          <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-primary/20 blur-3xl pointer-events-none"></div>

          <!-- Workspace Header -->
          <div class="relative z-10">
            <div class="flex items-center justify-between gap-3 pb-6 border-b border-white/5">
              <a routerLink="/" class="flex items-center gap-3 overflow-hidden">
                <div class="w-10 h-10 rounded-2xl bg-gradient-primary p-0.5 shadow-lg flex-shrink-0">
                  <div class="w-full h-full bg-brand-nav rounded-[14px] flex items-center justify-center font-black text-brand-surface">
                    ZH
                  </div>
                </div>
                @if (!sidebarCollapsed()) {
                  <div class="overflow-hidden">
                    <h2 class="font-extrabold text-lg tracking-tight leading-none text-white">Zero<span class="text-brand-emerald">Hunger</span></h2>
                    <span class="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Food Rescue</span>
                  </div>
                }
              </a>

              <button
                (click)="toggleSidebar()"
                class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-all cursor-pointer"
                [title]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
              >
                <svg class="w-4 h-4 transform transition-transform" [ngClass]="{'rotate-180': sidebarCollapsed()}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                </svg>
              </button>
            </div>

            <!-- Profile Summary Card -->
            @if (!sidebarCollapsed() && currentUser(); as user) {
              <div class="mt-6 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer" (click)="toggleProfileMenu()">
                <div class="w-10 h-10 rounded-xl bg-gradient-indigo text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {{ user.fullName.charAt(0).toUpperCase() }}
                </div>
                <div class="overflow-hidden flex-1">
                  <p class="text-sm font-bold text-white truncate">{{ user.fullName }}</p>
                  <span class="text-[10px] uppercase tracking-wider font-semibold text-brand-muted block">{{ user.role.replace('_', ' ') }}</span>
                </div>
              </div>
            }

            <!-- Navigation Links -->
            <nav class="mt-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-320px)] pr-1" style="scrollbar-width: none;">
              @for (item of filteredNavItems(); track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-gradient-primary text-white font-bold shadow-lg shadow-brand-primary/30 border-white/10"
                  [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                  class="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all border border-transparent"
                  [title]="item.label"
                >
                  <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
                  @if (!sidebarCollapsed()) {
                    <span class="truncate flex-1">{{ item.label }}</span>
                    @if (item.badge) {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-danger text-white">{{ item.badge }}</span>
                    }
                  }
                </a>
              }
            </nav>
          </div>

          <!-- Sidebar Footer / Logout -->
          <div class="relative z-10 pt-4 border-t border-white/5">
            <button
              (click)="logout()"
              class="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[13px] font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              @if (!sidebarCollapsed()) {
                <span>Sign Out</span>
              }
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Shell Content Area -->
      <div
        class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out"
        [ngClass]="sidebarCollapsed() ? 'pl-28' : 'pl-80'"
      >
        <!-- Top Glass Header Bar -->
        <header class="sticky top-0 z-40 h-20 px-8 flex items-center justify-between glass-panel border-b border-brand-borderLight">
          <!-- Global Search Pill -->
          <div class="relative max-w-md w-full">
            <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-brand-border focus-within:border-brand-primary focus-within:shadow-premium transition-all">
              <svg class="w-5 h-5 text-brand-textSec" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search food, donations, logistics... (⌘K)"
                class="w-full bg-transparent border-none text-sm text-brand-text placeholder-brand-textSec focus:outline-none"
              />
            </div>
          </div>

          <!-- Quick Actions & User Menu -->
          <div class="flex items-center gap-5">
            <a
              routerLink="/dashboard/food/create"
              class="btn-primary"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>Post Food Rescue</span>
            </a>

            <!-- Notification Drawer Toggle -->
            <app-notification-center></app-notification-center>

            <!-- Profile Menu Dropdown -->
            <div class="relative">
              <button
                (click)="toggleProfileMenu()"
                class="flex items-center gap-3 p-1.5 pr-4 rounded-2xl border border-brand-border bg-white hover:border-brand-primary/30 hover:shadow-subtle transition-all"
              >
                <div class="w-9 h-9 rounded-[10px] bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                  {{ currentUser()?.fullName?.charAt(0) || 'U' }}
                </div>
                <span class="text-sm font-bold text-brand-text hidden sm:inline">{{ currentUser()?.fullName }}</span>
                <svg class="w-4 h-4 text-brand-textSec" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              @if (showProfileMenu()) {
                <div class="absolute right-0 mt-3 w-64 zh-card p-2 z-50" @dropdown>
                  <div class="px-3 py-3 border-b border-brand-borderLight mb-2">
                    <p class="font-bold text-sm text-brand-text">{{ currentUser()?.fullName }}</p>
                    <p class="text-xs text-brand-textSec truncate">{{ currentUser()?.email }}</p>
                  </div>
                  <a routerLink="/dashboard/settings" (click)="showProfileMenu.set(false)" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-brand-text hover:bg-brand-bg rounded-xl transition-colors">
                    <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Settings & Profile
                  </a>
                  <button (click)="logout()" class="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-brand-danger hover:bg-rose-50 rounded-xl transition-colors mt-1">
                    <svg class="w-4 h-4 text-brand-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Sign Out
                  </button>
                </div>
              }
            </div>
          </div>
        </header>

        <!-- Viewport Outlet -->
        <main class="p-8 flex-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly currentUser = this.authService.currentUser;
  readonly sidebarCollapsed = signal(false);
  readonly showNotifications = signal(false);
  readonly showProfileMenu = signal(false);
  readonly notificationsCount = signal(3);

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Executive Analytics', icon: '📊' },
    { path: '/dashboard/food', label: 'Food Rescue Listings', icon: '🍱' },
    { path: '/dashboard/food/create', label: 'Post Donation', icon: '➕', roles: ['restaurant', 'donor', 'admin'] },
    { path: '/dashboard/requests', label: 'Food Requests', icon: '📝' },
    { path: '/dashboard/donations', label: 'Donations Hub', icon: '🎁' },
    { path: '/dashboard/volunteer', label: 'Volunteer Courier', icon: '🤝', roles: ['volunteer', 'admin'] },
    { path: '/dashboard/ngo', label: 'NGO Partner Portal', icon: '🏢', roles: ['ngo', 'admin'] },
    { path: '/dashboard/home-food/customer', label: 'Request Home Food', icon: '🍲', roles: ['customer', 'admin'] },
    { path: '/dashboard/home-food/maker', label: 'Maker Dashboard', icon: '👩‍🍳', roles: ['home_food_maker', 'admin'] },
    { path: '/dashboard/home-food/delivery', label: 'Food Deliveries', icon: '🛵', roles: ['delivery_partner', 'admin'] },
    { path: '/dashboard/admin', label: 'Platform Control', icon: '⚙️', roles: ['admin'] },
    { path: '/dashboard/settings', label: 'System Settings', icon: '🛠️' },
  ];

  notifications = [
    { id: '1', icon: '🍱', title: 'New surplus food posted near you', time: '10 mins ago' },
    { id: '2', icon: '✅', title: 'Request #ZH-102 verified by NGO', time: '1 hour ago' },
    { id: '3', icon: '🤝', title: 'Volunteer assigned to pickup #ZH-88', time: '3 hours ago' },
  ];

  filteredNavItems(): NavItem[] {
    const role = this.currentUser()?.role;
    return this.navItems.filter(item => {
      if (!item.roles) return true;
      return role && item.roles.includes(role);
    });
  }

  toggleSidebar(): void { this.sidebarCollapsed.update(c => !c); }
  toggleNotifications(): void { this.showNotifications.update(n => !n); this.showProfileMenu.set(false); }
  toggleProfileMenu(): void { this.showProfileMenu.update(p => !p); this.showNotifications.set(false); }

  clearNotifications(): void {
    this.notifications = [];
    this.notificationsCount.set(0);
    this.toast.info('Notifications cleared');
  }

  logout(): void {
    this.authService.logout();
    this.toast.info('Signed out successfully');
  }
}
