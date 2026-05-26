import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasCurrentSessionGuard } from './has-current-session-guard';

describe('hasCurrentSessionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => hasCurrentSessionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
