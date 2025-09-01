// core/interceptors/auth-token.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('zinnia_token');

    const setHeaders: Record<string,string> = { 'Accept': 'application/json' };
    if (token) setHeaders['X-Auth-Token'] = token; // ← lo recomendado por tu backend
    // Si algún día te piden Bearer:
    // if (token) setHeaders['Authorization'] = `Bearer ${token}`;

    // No fijamos Content-Type si es FormData o GET/DELETE.
    if (!(req.body instanceof FormData) && req.method !== 'GET' && req.method !== 'DELETE'
        && !req.headers.has('Content-Type')) {
      setHeaders['Content-Type'] = 'application/json';
    }
    return next.handle(req.clone({ setHeaders }));
  }
}
