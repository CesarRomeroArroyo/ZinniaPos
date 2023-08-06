
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProxyInterceptorService implements HttpInterceptor {
  
  constructor(
    private localStorage: LocalStorageService
  ) { }
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.localStorage.getItem('ZINNIA_USER');
    
    
      const headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Zinniatoken: user?.token??"0",        
        Location: user?.location??"0"        
      });
    
    
      const reqClone = req.clone({ headers });
      
      return next.handle(reqClone);
    
  }
}
