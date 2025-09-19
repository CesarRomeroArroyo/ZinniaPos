// src/app/core/services/interceptors/interceptor.service.ts
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { StorageKeys } from "../../consts/enums/storage-keys.enum";
import { ResponseModalComponent } from "src/app/shared/components/response-modal/response-modal.component";
import {
  errorConnectionResponse,
  errorSessionResponse,
} from "../../consts/enums/connection-error-modal";
import { HttpErrors } from "../../consts/enums/http-errors.enum";
import { Router } from "@angular/router";
import { LocalStorageService } from "../utils/storage/local-storage.service";

@Injectable()
export class InterceptorService implements HttpInterceptor {
  private isModalOpen = false;

  constructor(
    private _modalCtrl: ModalController,
    private _router: Router,
    private _localStorageService: LocalStorageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Endpoints que no llevan auth
    const authorizationEndpoints = ["/sign-in", "/sign-up", "/send-code-password"]
      .some(endpoint => request.url.includes(endpoint));

    const isGetOrDelete = request.method === "GET" || request.method === "DELETE";
    const isFormData = request.body instanceof FormData;

    // Evitar preflight en /clientes (POST upsert): no enviar Authorization allí
    const isClientes = /\/clientes\/?$/.test(request.url);

    const token = window.localStorage.getItem(StorageKeys.TOKEN);

    // Headers "simples" por defecto
    const setHeaders: Record<string, string> = {
      Accept: "application/json",
      // (no Cache-Control/Pragma/X-* en GET para no disparar preflight)
    };

    // Mandar Authorization solo cuando toca y NO en GET/DELETE ni en /clientes
    if (token && !authorizationEndpoints && !isGetOrDelete && !isClientes) {
      setHeaders["Authorization"] = `Bearer ${token}`;
    }

    // No forzar Content-Type si ya viene, si es FormData, o si es GET/DELETE
    if (!isFormData && !isGetOrDelete && !request.headers.has("Content-Type")) {
      setHeaders["Content-Type"] = "application/json";
    }

    const req = request.clone({ setHeaders });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // CORS/Red bloqueada: status 0 o "Unknown Error"
        if (error.status === 0 || error.statusText === HttpErrors.UNKNOWN_ERROR) {
          this.openValidationModal(errorConnectionResponse);
        }

        // Sesión inválida (401 o mensajes del backend)
        const unauthorizedMsg = error?.error?.message;
        const isUnauthorized =
          error.status === 401 ||
          unauthorizedMsg === HttpErrors.USER_NOT_FOUND ||
          unauthorizedMsg === HttpErrors.UNAUTHORIZED;

        if (!authorizationEndpoints && isUnauthorized) {
          this.logout();
          this.openValidationModal(errorSessionResponse);
        }

        return throwError(() => error);
      }),
      finalize(() => {})
    );
  }

  private async openValidationModal(message: any) {
    if (this.isModalOpen) return;
    this.isModalOpen = true;
    const modal = await this._modalCtrl.create({
      component: ResponseModalComponent,
      cssClass: "response-modal",
      componentProps: message,
    });
    await modal.present();
    await modal.onWillDismiss();
    this.isModalOpen = false;
  }

  private logout() {
    this._localStorageService.removeItem(StorageKeys.USER_DATA);
    this._localStorageService.removeItem(StorageKeys.TOKEN);
    this._router.navigateByUrl("/login");
  }
}
