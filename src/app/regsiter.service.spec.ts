import { TestBed } from '@angular/core/testing';

import { RegsiterService } from './regsiter.service';

describe('RegsiterService', () => {
  let service: RegsiterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegsiterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
