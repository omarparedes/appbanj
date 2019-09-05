import { TestBed } from '@angular/core/testing';

import { InversionService } from './inversion.service';

describe('InversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InversionService = TestBed.get(InversionService);
    expect(service).toBeTruthy();
  });
});
