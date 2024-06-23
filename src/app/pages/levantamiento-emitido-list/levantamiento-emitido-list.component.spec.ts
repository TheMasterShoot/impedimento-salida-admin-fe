import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { LevantamientoEmitidoListComponent } from './levantamiento-emitido-list.component';

describe('LevantamientoEmitidoListComponent', () => {
    let component: LevantamientoEmitidoListComponent;
    let fixture: ComponentFixture<LevantamientoEmitidoListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LevantamientoEmitidoListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LevantamientoEmitidoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
