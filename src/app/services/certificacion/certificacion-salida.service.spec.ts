import { TestBed } from '@angular/core/testing';

import { CertificacionSalidaService } from './certificacion-salida.service';

describe('CertificacionSalidaService', () => {
  let service: CertificacionSalidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificacionSalidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
