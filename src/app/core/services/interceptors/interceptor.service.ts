import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { StorageKeys } from '../../consts/enums/storage-keys.enum';
import { ResponseModalComponent } from 'src/app/shared/components/response-modal/response-modal.component';
import { errorConnectionResponse, errorSessionResponse } from '../../consts/enums/connection-error-modal';
import { HttpErrors } from '../../consts/enums/http-errors.enum';
import { Router } from '@angular/router';
import { LocalStorageService } from '../utils/storage/local-storage.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  private isModalOpen = false;

  constructor(
    private _modalCtrl: ModalController,
    private _router: Router,
    private _localStorageService: LocalStorageService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authorizationEndpoints = ['/sign-in', '/sign-up', '/send-code-password',].some(endpoint => request.url.includes(endpoint));

    let headers: any;

    if (!['/reverse', '/geocode/', '/directions/'].some(endpoint => request.url.includes(endpoint))) {
      headers = { 'Cache-Control': 'no-cache' };
    }

    if (!authorizationEndpoints) {
      const token = window.localStorage.getItem(StorageKeys.TOKEN);
      headers = { ...headers, Authorization: `Bearer ${token}` }
    }

    request = request.clone({
      setHeaders: headers
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.statusText === HttpErrors.UNKNOWN_ERROR && !request.url.includes('/geocode/')) {
          this.openValidationModal(errorConnectionResponse);
        }
        if (!authorizationEndpoints && (error.error.message === HttpErrors.USER_NOT_FOUND || error.error.message === HttpErrors.UNAUTHORIZED) ) {
          this.logout();
          this.openValidationModal(errorSessionResponse);
        }
        return throwError(error);
      }),
      finalize(() => {

      })
    );
  }

  private async openValidationModal(message: any) {
    if (this.isModalOpen) {
      return;
    }
    this.isModalOpen = true;
    const modal = await this._modalCtrl.create({
      component: ResponseModalComponent,
      cssClass: 'response-modal',
      componentProps: message
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.isModalOpen = false;
  }

  private logout() {
    this._localStorageService.removeItem(StorageKeys.USER_DATA);
    this._localStorageService.removeItem(StorageKeys.TOKEN);
    this._router.navigateByUrl('/login');
  }
}

