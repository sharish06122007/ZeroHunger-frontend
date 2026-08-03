// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Splash / Onboarding
  {
    path: '',
    loadComponent: () => import('./features/splash/splash.component').then(m => m.SplashComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component').then(m => m.WelcomeComponent),
  },

  {
    path: 'zerohunger-loader',
    loadComponent: () => import('./components/zerohunger-loader/zerohunger-loader.component').then(m => m.ZerohungerLoaderComponent),
  },

  // Auth Flow
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
      },
      {
        path: 'loading',
        loadComponent: () => import('./features/auth/login-transition/login-transition.component').then(m => m.LoginTransitionComponent),
      },
      {
        path: 'profile-setup',
        loadComponent: () => import('./features/auth/profile-setup/profile-setup.component').then(m => m.ProfileSetupComponent),
        canActivate: [authGuard],
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // Protected: Dashboard & Features
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/home/dashboard-home.component').then(m => m.DashboardHomeComponent),
      },
      {
        path: 'food',
        loadComponent: () => import('./features/food/food-list/food-list.component').then(m => m.FoodListComponent),
      },
      {
        path: 'food/create',
        loadComponent: () => import('./features/food/food-create/food-create.component').then(m => m.FoodCreateComponent),
        canActivate: [roleGuard],
        data: { roles: ['restaurant', 'donor', 'admin'] },
      },
      {
        path: 'food/:id',
        loadComponent: () => import('./features/food/food-detail/food-detail.component').then(m => m.FoodDetailComponent),
      },
      {
        path: 'requests',
        loadComponent: () => import('./features/requests/requests-list/requests-list.component').then(m => m.RequestsListComponent),
      },
      {
        path: 'donations',
        loadComponent: () => import('./features/donations/donations-list/donations-list.component').then(m => m.DonationsListComponent),
      },
      {
        path: 'volunteer',
        loadComponent: () => import('./features/volunteer/volunteer-dashboard/volunteer-dashboard.component').then(m => m.VolunteerDashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['volunteer', 'admin'] },
      },
      {
        path: 'ngo',
        loadComponent: () => import('./features/ngo/ngo-dashboard/ngo-dashboard.component').then(m => m.NgoDashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['ngo', 'admin'] },
      },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
      },
    ],
  },

  // Landing Pages
  {
    path: 'home',
    loadComponent: () => import('./landing/home/home.component').then(m => m.HomeComponent),
  },

  // 404
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
