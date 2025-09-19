import { Injectable } from '@angular/core';
import { SessionStorageService } from './storage/session-storage.service';
import { ILoginRequest, ILoginResponse } from '../../interfaces/bussiness/login.interface';
import { IUser } from '../../interfaces/bussiness/user.interface';
import { Observable, throwError, tap, catchError, switchMap, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../bussiness/auth.service';
import { StorageKeys } from '../../consts/enums/storage-keys.enum';
import { CompanyService } from '../bussiness/company.service';
import { ICompany } from '../../interfaces/bussiness/company.interface';
import { InitialBusinessSettingService } from './initial-setting.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {

  private readonly USER_KEY = StorageKeys.USER_DATA;
  private readonly COMPANY_KEY = StorageKeys.COMPANY_DATA;

  private userAuthenticatedSubject = new Subject<ICompany>();
  public userAuthenticated$ = this.userAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private authService: AuthService,
    private _companyService: CompanyService,
    private sessionStorage: SessionStorageService,
  ) {}

  public login(payload: ILoginRequest): Observable<ILoginResponse> {
    return this.authService.login(payload).pipe(
      switchMap((response: ILoginResponse) => {
        if (response.length) {
          const user = response[0];
          this.sessionStorage.setProperty(this.USER_KEY, user);
          return this._companyService.getCompanyByUser(user.idunico).pipe(
            tap(company => {
              this.sessionStorage.setProperty(this.COMPANY_KEY, company);
              this.userAuthenticatedSubject.next(company);
            }),
            switchMap(() => [response])
          );
        } else {
          return throwError(() => new Error('Credenciales incorrectas. Verifica tu correo y contraseña.'));
        }
      }),
      catchError(err => {
        const message = err?.error?.message || 'Ocurrió un error al iniciar sesión.';
        return throwError(() => new Error(message));
      })
    );
  }

  public logout(): void {
    this.sessionStorage.clearSession();
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return !!this.sessionStorage.getProperty<IUser>(this.USER_KEY);
  }

  public getCurrentUser(): IUser | null {
    return this.sessionStorage.getProperty<IUser>(this.USER_KEY);
  }

  public getUserCompany(): ICompany | null {
    return this.sessionStorage.getProperty<ICompany>(this.COMPANY_KEY);
  }
}
