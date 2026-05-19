import { TestBed } from '@angular/core/testing';

import { ModAuthService } from './mod-auth-service';

describe('ModAuthService', () => {
  let service: ModAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
