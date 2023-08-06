import { TestBed } from '@angular/core/testing';

import { ProxyInterceptorService } from './proxy-interceptor.service';

describe('ProxyInterceptorService', () => {
  let service: ProxyInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProxyInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
