import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as string;

  if (!requiredRole) return true;

  const userRole = authService.getRoleFromToken();
  if (userRole === requiredRole || userRole === 'ROLE_ADMIN') {
    return true;
  }

  // Redirect to dashboard if they don't have the required role
  router.navigate(['/dashboard']);
  return false;
};
