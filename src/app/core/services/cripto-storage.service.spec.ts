import { TestBed } from '@angular/core/testing';

import { CriptoStorageService } from './cripto-storage.service';

describe('CriptoStorageService', () => {
  let service: CriptoStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriptoStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
