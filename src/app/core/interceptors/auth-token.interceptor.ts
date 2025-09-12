// core/interceptors/auth-token.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si el request pide saltar auth, NO agregamos headers custom (evita preflight)
    if (req.headers.has('X-Skip-Auth')) {
      const clean = req.clone({ headers: req.headers.delete('X-Skip-Auth') });
      return next.handle(clean);
    }

    const token = localStorage.getItem('zinnia_token');
    const headerMap: Record<string,string> = { 'Accept': 'application/json' };

    if (token) {
      // Este header personalizado provoca preflight. Úsalo SOLO si el endpoint lo exige.
      headerMap['X-Auth-Token'] = token;
      // Si en el futuro usas Bearer, también causará preflight:
      // headerMap['Authorization'] = `Bearer ${token}`;
    }

    // No fijes Content-Type si es FormData o GET/DELETE; si el request ya puso Content-Type, respétalo.
    const isForm = req.body instanceof FormData;
    const shouldSetCT = !isForm && req.method !== 'GET' && req.method !== 'DELETE' && !req.headers.has('Content-Type');
    if (shouldSetCT) headerMap['Content-Type'] = 'application/json';

    return next.handle(req.clone({ setHeaders: headerMap }));
  }
}
