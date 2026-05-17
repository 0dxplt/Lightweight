import { TestBed } from '@angular/core/testing';

import { GetRankedUsersService } from './ranking-service';

describe('GetRankedUsersService', () => {
  let service: GetRankedUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRankedUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
