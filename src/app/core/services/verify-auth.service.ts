import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class VerifyAuthService {

  constructor(private localStorage: LocalStorageService) { }

  verifyLogged(): Observable<boolean>{
    if(!this.localStorage.getItem("ZINNIA_USER")){
      return of(false)
    } else {
      return of(true)
    }
  }
}
