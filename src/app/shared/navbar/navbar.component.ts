import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/authentication/auth.service';
import { LucideAngularModule, Search, Bell, User, Menu, X, ChevronDown, LogOut, Settings } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly Search = Search;
  readonly Bell = Bell;
  readonly User = User;
  readonly Menu = Menu;
  readonly X = X;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;
  readonly Settings = Settings;

  isMobileMenuOpen = false;
  isNotificationsOpen = false;
  isProfileOpen = false;

  readonly publicNavLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Find Food', path: '/dashboard/food' },
    { label: 'Provide Food', path: '/dashboard/provide' },
    { label: 'NGO Requests', path: '/dashboard/ngo' },
    { label: 'Community', path: '/community' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  readonly notifications = [
    { title: 'New Surplus Request', message: 'Green Harvest Bakery posted 40 kg fresh bread', time: '5m ago', unread: true },
    { title: 'Pickup Confirmed', message: 'Volunteer Alex accepted donation #8492', time: '12m ago', unread: true },
    { title: 'Impact Milestone', message: '180,000 meals rescued in your city!', time: '1h ago', unread: false },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) this.isProfileOpen = false;
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) this.isNotificationsOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isProfileOpen = false;
  }
}
