import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';

export const hasCurrentSessionGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.currentSession()) {
    router.navigate(["/workouts"]);
    return false;
  }
  return true;
};
