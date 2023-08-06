import { TestBed } from '@angular/core/testing';

import { LogitGuardService } from './logit-guard.service';

describe('LogitGuardService', () => {
  let service: LogitGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogitGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
