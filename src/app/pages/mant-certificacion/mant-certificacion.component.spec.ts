import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantCertificacionComponent } from './mant-certificacion.component';

describe('MantCertificacionComponent', () => {
  let component: MantCertificacionComponent;
  let fixture: ComponentFixture<MantCertificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantCertificacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
