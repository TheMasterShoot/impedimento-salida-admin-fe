import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { CertificacionExistenciaEmitidaListComponent } from './certificacion-existencia-emitida-list.component';

describe('CertificacionExistenciaEmitidaListComponent', () => {
    let component: CertificacionExistenciaEmitidaListComponent;
    let fixture: ComponentFixture<CertificacionExistenciaEmitidaListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CertificacionExistenciaEmitidaListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CertificacionExistenciaEmitidaListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
