import { TestBed } from '@angular/core/testing';

import { SimuladorService } from './simulador.service';

describe('SimuladorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimuladorService = TestBed.get(SimuladorService);
    expect(service).toBeTruthy();
  });
});
