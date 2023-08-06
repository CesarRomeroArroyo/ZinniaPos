import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VerifyAuthService } from '../services/verify-auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {


  constructor(
    private verifyAuth: VerifyAuthService,
    private router: Router
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      return this.verifyAuth.verifyLogged()
      .pipe(
        tap(auth => {
          if (!auth) {
            this.router.navigate(['login']);
          } else {
            next;
          }
        })
      )

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

      return this.verifyAuth.verifyLogged()
      .pipe(
        tap(auth => {
          if (!auth) {
            this.router.navigate(['login']);
          } 
        })
      )

  }
}
