import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { catchError, first, map, of } from 'rxjs';
import { AuthService } from '../bussiness/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private _authService: AuthService,
  ) { }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.root.get('password');
    const confirmPassword = control.value;
    if (newPassword && newPassword.value !== confirmPassword) {
      return { 'passwordsNotMatch': true };
    }
    return null;
  }

  emailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);

      return this._authService.verifyEmail(control.value).pipe(
        map(response => {
          const correoEnUso = response.some(r => r.estado !== '0');
          return correoEnUso ? { emailTaken: true } : null;
        }),
        catchError(() => of(null)),
        first()
      );
    };
  }

}
