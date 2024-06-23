import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { LevantamientoProcesandoListComponent } from './levantamiento-procesando-list.component';

describe('LevantamientoProcesandoListComponent', () => {
    let component: LevantamientoProcesandoListComponent;
    let fixture: ComponentFixture<LevantamientoProcesandoListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LevantamientoProcesandoListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LevantamientoProcesandoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
