import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModAuthService } from '../services/mod-auth-service';

export const modAuthGuard= (modPage = true): CanActivateFn => {
  return () => {
    const modAuthService = inject(ModAuthService);
    const router = inject(Router);

    const modLogged = modAuthService.isModLogged();
    if (modPage && modLogged) return true;
    if (!modPage && !modLogged) return true;

    return router.navigate([modPage ? "mod/login" : "mod"]);
  };
}