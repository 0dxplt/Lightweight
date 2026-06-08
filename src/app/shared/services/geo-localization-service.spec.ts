import { TestBed } from '@angular/core/testing';

import { GeoLocalizationService } from './geo-localization-service';

describe('GeoLocalizationService', () => {
  let service: GeoLocalizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoLocalizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
