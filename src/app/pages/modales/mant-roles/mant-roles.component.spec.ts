import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MantRolesComponent } from './mant-roles.component';

describe('MantRolesComponent', () => {
  let component: MantRolesComponent;
  let fixture: ComponentFixture<MantRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
