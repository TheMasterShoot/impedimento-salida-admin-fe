import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { CertificacionExistenciaProcesandoListComponent } from './certificacion-existencia-procesando-list.component';


describe('CertificacionExistenciaProcesandoListComponent', () => {
    let component: CertificacionExistenciaProcesandoListComponent;
    let fixture: ComponentFixture<CertificacionExistenciaProcesandoListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CertificacionExistenciaProcesandoListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CertificacionExistenciaProcesandoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
