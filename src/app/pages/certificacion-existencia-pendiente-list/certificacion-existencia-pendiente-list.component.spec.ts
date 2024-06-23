import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { CertificacionExistenciaPendienteListComponent } from './certificacion-existencia-pendiente-list.component';

describe('CertificacionExistenciaPendienteListComponent', () => {
    let component: CertificacionExistenciaPendienteListComponent;
    let fixture: ComponentFixture<CertificacionExistenciaPendienteListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CertificacionExistenciaPendienteListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CertificacionExistenciaPendienteListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
