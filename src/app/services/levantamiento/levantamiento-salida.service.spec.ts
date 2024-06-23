import { TestBed } from '@angular/core/testing';

import { LevantamientoSalidaService } from './levantamiento-salida.service';

describe('LevantamientoSalidaService', () => {
  let service: LevantamientoSalidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevantamientoSalidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
