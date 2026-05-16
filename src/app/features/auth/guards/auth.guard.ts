import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth-service';

export const authGuard = (loggedPage = true): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const logged = authService.isLogged();

    if (loggedPage && logged) return true;
    if (!loggedPage && !logged) return true;

    return router.parseUrl(!loggedPage ? '/tabs/workouts' : '/login');
  };
};