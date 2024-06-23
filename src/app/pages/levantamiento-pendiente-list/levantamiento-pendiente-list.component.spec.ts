import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { LevantamientoPendienteListComponent } from './levantamiento-pendiente-list.component';

describe('LevantamientoPendienteListComponent', () => {
    let component: LevantamientoPendienteListComponent;
    let fixture: ComponentFixture<LevantamientoPendienteListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LevantamientoPendienteListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LevantamientoPendienteListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
