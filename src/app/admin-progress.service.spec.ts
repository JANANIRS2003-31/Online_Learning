import { TestBed } from '@angular/core/testing';

import { AdminProgressService } from './admin-progress.service';

describe('AdminProgressService', () => {
  let service: AdminProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
