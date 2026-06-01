import { TestBed } from '@angular/core/testing';

import { MuscolarGroupsService } from './muscolar-groups-service';

describe('MuscolarGroupsService', () => {
  let service: MuscolarGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuscolarGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
