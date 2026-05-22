import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { modAuthGuardGuard } from './mod-auth-guard';

describe('modAuthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => modAuthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
