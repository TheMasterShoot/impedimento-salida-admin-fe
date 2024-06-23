import { TestBed } from '@angular/core/testing';
import { RechazoService } from './rechazo.service';


describe('RechazoService', () => {
  let service: RechazoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RechazoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
