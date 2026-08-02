// core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const allowedRoles: UserRole[] = route.data['roles'] ?? [];
  if (allowedRoles.length === 0 || authService.hasRole(...allowedRoles)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
