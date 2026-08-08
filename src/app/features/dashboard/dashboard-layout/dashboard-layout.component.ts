import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationCenterComponent } from '../../../shared/components/notification-center/notification-center.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { LucideAngularModule } from 'lucide-angular';
import { ZhAvatarComponent } from '../../../shared/components/ui/zh-avatar/zh-avatar.component';
import { ZhBadgeComponent } from '../../../shared/components/ui/zh-badge/zh-badge.component';

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
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationCenterComponent, LucideAngularModule, ZhAvatarComponent, ZhBadgeComponent],
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
    <div class="min-h-screen flex bg-brand-bg text-brand-text">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-out bg-white border-r border-brand-border shadow-subtle"
        [ngClass]="sidebarCollapsed() ? 'w-20' : 'w-64'"
      >
        <div class="h-full flex flex-col justify-between py-6 px-4">
          <!-- Workspace Header -->
          <div>
            <div class="flex items-center justify-between gap-3 pb-6 mb-6 border-b border-brand-border">
              <a routerLink="/" class="flex items-center gap-3 overflow-hidden">
                <div class="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg flex-shrink-0">
                  <lucide-icon name="home" class="w-5 h-5 text-white"></lucide-icon>
                </div>
                @if (!sidebarCollapsed()) {
                  <div class="overflow-hidden">
                    <h2 class="font-extrabold text-lg tracking-tight leading-none text-brand-dark">Zero<span class="text-brand-primary">Hunger</span></h2>
                  </div>
                }
              </a>
            </div>

            <!-- Profile Summary Card -->
            @if (!sidebarCollapsed() && currentUser(); as user) {
              <div class="mb-6 p-3 rounded-2xl bg-brand-primary-very-light/50 border border-brand-primary-light/30 flex items-center gap-3 cursor-pointer hover:bg-brand-primary-very-light transition-colors" (click)="toggleProfileMenu()">
                <app-zh-avatar [name]="user.fullName" size="sm" [verified]="true"></app-zh-avatar>
                <div class="overflow-hidden flex-1">
                  <p class="text-sm font-bold text-brand-text truncate">{{ user.fullName }}</p>
                  <span class="text-[10px] uppercase tracking-wider font-semibold text-brand-primary block">{{ user.role }}</span>
                </div>
              </div>
            }

            <!-- Navigation Links -->
            <nav class="space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-hide">
              @for (item of filteredNavItems(); track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20"
                  [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                  #rla="routerLinkActive"
                  class="flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all group"
                  [ngClass]="rla.isActive ? '' : 'text-brand-muted hover:bg-brand-bg hover:text-brand-text'"
                  [title]="item.label"
                >
                  <lucide-icon [name]="item.icon" class="w-5 h-5 flex-shrink-0"></lucide-icon>
                  @if (!sidebarCollapsed()) {
                    <span class="truncate flex-1">{{ item.label }}</span>
                    @if (item.badge) {
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-accent-warm text-white">{{ item.badge }}</span>
                    }
                  }
                </a>
              }
            </nav>
          </div>

          <!-- Sidebar Footer / Logout -->
          <div class="pt-4 mt-6 border-t border-brand-border">
            <button
              (click)="toggleSidebar()"
              class="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl text-brand-muted hover:bg-brand-bg transition-colors mb-2"
              [title]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            >
              <lucide-icon name="panel-left-open" class="w-5 h-5 flex-shrink-0 transform transition-transform" [ngClass]="{'rotate-180': sidebarCollapsed()}"></lucide-icon>
              @if (!sidebarCollapsed()) {
                <span class="text-sm font-medium">Collapse</span>
              }
            </button>
            <button
              (click)="logout()"
              class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <lucide-icon name="log-out" class="w-5 h-5 flex-shrink-0"></lucide-icon>
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
        [ngClass]="sidebarCollapsed() ? 'ml-20' : 'ml-64'"
      >
        <!-- Top Glass Header Bar -->
        <header class="sticky top-0 z-40 h-20 px-8 flex items-center justify-between backdrop-blur-md bg-brand-bg/80 border-b border-brand-border">
          <!-- Global Search Pill -->
          <div class="relative max-w-md w-full">
            <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-brand-border focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all shadow-sm">
              <lucide-icon name="search" class="w-4 h-4 text-brand-muted"></lucide-icon>
              <input
                type="text"
                placeholder="Search food, orders, people... (⌘K)"
                class="w-full bg-transparent border-none text-sm text-brand-text placeholder-brand-muted focus:outline-none"
              />
            </div>
          </div>

          <!-- Quick Actions & User Menu -->
          <div class="flex items-center gap-4">
            <!-- Notification Drawer Toggle -->
            <app-notification-center></app-notification-center>

            <!-- Profile Menu Dropdown -->
            <div class="relative">
              <button
                (click)="toggleProfileMenu()"
                class="flex items-center gap-2"
              >
                <app-zh-avatar [name]="currentUser()?.fullName || 'User'" size="md"></app-zh-avatar>
                <lucide-icon name="chevron-down" class="w-4 h-4 text-brand-muted hidden sm:block"></lucide-icon>
              </button>

              @if (showProfileMenu()) {
                <div class="absolute right-0 mt-3 w-60 bg-white p-2 rounded-2xl shadow-float z-50 border border-brand-border" @dropdown>
                  <div class="px-3 py-3 border-b border-brand-border mb-2">
                    <p class="font-bold text-sm text-brand-text">{{ currentUser()?.fullName }}</p>
                    <p class="text-xs text-brand-muted truncate">{{ currentUser()?.email }}</p>
                  </div>
                  <a routerLink="/dashboard/settings" (click)="showProfileMenu.set(false)" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-brand-text hover:bg-brand-bg rounded-xl transition-colors">
                    <lucide-icon name="user" class="w-4 h-4 text-brand-primary"></lucide-icon>
                    Profile Settings
                  </a>
                  <button (click)="logout()" class="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1">
                    <lucide-icon name="log-out" class="w-4 h-4 text-red-500"></lucide-icon>
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
    { path: '/dashboard', label: 'Overview', icon: 'layout-dashboard' },
    
    // Customer
    { path: '/dashboard/home-food/customer', label: 'Find Food', icon: 'search', roles: ['customer', 'admin'] },
    { path: '/dashboard/requests', label: 'My Requests', icon: 'clipboard-list', roles: ['customer', 'admin'] },
    
    // Maker
    { path: '/dashboard/home-food/maker', label: 'Maker Dashboard', icon: 'chef-hat', roles: ['home_food_maker', 'admin'] },
    { path: '/dashboard/food/create', label: 'Post Food', icon: 'plus-circle', roles: ['home_food_maker', 'restaurant', 'admin'] },
    
    // Delivery
    { path: '/dashboard/home-food/delivery', label: 'Deliveries', icon: 'truck', roles: ['delivery_partner', 'admin'] },
    
    // NGO/Volunteer
    { path: '/dashboard/ngo', label: 'NGO Impact', icon: 'building-2', roles: ['ngo', 'admin'] },
    { path: '/dashboard/volunteer', label: 'Volunteer Hub', icon: 'heart-handshake', roles: ['volunteer', 'admin'] },
    { path: '/dashboard/donations', label: 'Donations', icon: 'gift', roles: ['ngo', 'volunteer', 'admin'] },
    
    // Admin
    { path: '/dashboard/admin', label: 'Admin Portal', icon: 'shield', roles: ['admin'] },
    
    // Common
    { path: '/dashboard/messages', label: 'Messages', icon: 'message-square', badge: 2 },
    { path: '/dashboard/payments', label: 'Payments', icon: 'credit-card' },
    { path: '/dashboard/settings', label: 'Settings', icon: 'settings' },
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

  logout(): void {
    this.authService.logout();
    this.toast.info('Signed out successfully');
  }
}
