import { TestBed } from '@angular/core/testing';

import { SolvedService } from './solved-service';

describe('SolvedService', () => {
  let service: SolvedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolvedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
