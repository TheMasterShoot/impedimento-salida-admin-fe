import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantSolicitudComponent } from './mant-solicitud.component';

describe('MantSolicitudComponent', () => {
  let component: MantSolicitudComponent;
  let fixture: ComponentFixture<MantSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantSolicitudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
