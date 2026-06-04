import { TestBed } from '@angular/core/testing';

import { PtsService } from './pts-service';

describe('PtsService', () => {
  let service: PtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
