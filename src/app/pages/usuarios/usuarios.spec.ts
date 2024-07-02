import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { LevantamientoRechazadoListComponent } from './levantamiento-rechazado-list.component';

describe('BlankComponent', () => {
    let component: LevantamientoRechazadoListComponent;
    let fixture: ComponentFixture<LevantamientoRechazadoListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LevantamientoRechazadoListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LevantamientoRechazadoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
