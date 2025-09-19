import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreService } from '../../services/utils/core.service';
import { LocalStorageService } from '../../services/utils/storage/local-storage.service';
import { StorageKeys } from '../../consts/enums/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedGuard implements CanActivate {

  constructor(
    private coreService: CoreService, 
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const userSesion = this.coreService.hasUserLogged();
      const isPresentated = this.localStorageService.getItem(StorageKeys.PRESENTATED);
      if (!userSesion && !isPresentated) {
        return true;
      } 

      if (!userSesion && !isPresentated) {
        this.router.navigate(['/presentation']);
      } 
      
      if(userSesion){
        this.router.navigate(['/home']);
      }

      return false;
  }
}
