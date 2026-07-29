import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./landing/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'impact',
    loadComponent: () => import('./landing/impact/impact.component').then((m) => m.ImpactComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./landing/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'donor',
    loadComponent: () => import('./features/donor/donor-dashboard/donor-dashboard.component').then((m) => m.DonorDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'donor' },
  },
  {
    path: 'volunteer',
    loadComponent: () => import('./features/volunteer/volunteer-dashboard/volunteer-dashboard.component').then((m) => m.VolunteerDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'volunteer' },
  },
  {
    path: 'ngo',
    loadComponent: () => import('./features/ngo/ngo-dashboard/ngo-dashboard.component').then((m) => m.NgoDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'ngo' },
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
