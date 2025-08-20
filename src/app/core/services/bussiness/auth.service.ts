import { delay, lastValueFrom, Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IEmailVerifyResponse } from '../../interfaces/bussiness/verify.interface';
import { ILoginRequest, ILoginResponse } from '../../interfaces/bussiness/login.interface';
import { IUser } from '../../interfaces/bussiness/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private registeredUsers: IUser[]  = [
        {
            id: "1",
            idunico: "2222",
            onesignal: "",
            fullname: 'Jorge Luis Mendez',
            email: 'jorge.mendezj@cecar.edu.co',
            activacion: "1101",
            estado: "1",
            mostrar: "",
            token: "b368126gw"
        },
        {
            id: '2',
            idunico: '33202',
            onesignal: '12345678',
            fullname: 'Maria Alejandra Mendez',
            email: 'maralmeji2@gmail.com',
            activacion: '2202',
            estado: '1',
            mostrar: '',
            token: 'H233847U'
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public login(payload: ILoginRequest): Observable<ILoginResponse>{
        /*
        return this._httpClient.post<Array<ILoginResponse>>(`${environment.API}login/`, payload)
        */
        const userFound = this.registeredUsers.find(user => user.email === payload.email);
        if (!userFound) {
            return throwError(() => new Error('Usuario no encontrado o credenciales inválidas'));
        }

        return of([userFound]).pipe(delay(3000));
    }

    public registerUser(newUser: any): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/register/`, payload
        ));
        */
        this.registeredUsers.push(newUser);
        return of(true).pipe(delay(3000));
    }

    public verifyEmail(email: string): Observable<IEmailVerifyResponse[]> {
        const mock = [{
            id: "1",
            idunico: "28778327",
            onesignal: "",
            fullname: "Jorge Luis Mendez",
            email: "jorge.mendezj@cecar.edu.co",
            activacion: "1101",
            estado: "0",
            mostrar: "1"
        }];
        const mock2: IEmailVerifyResponse[]  = [];
        return of(mock).pipe(delay(500));
    }

    public sendActivationCode(userId: string): Observable<boolean> {
        const responseMock = true;
        return of(responseMock).pipe(delay(3000));
    }

    public updateUserWithoutToken(data: any): Observable<boolean> {
        /*
        return this._http.put<any>(`${environment.API_WEB}updateuser/`, data);
        */
        return of(true).pipe(delay(3000));
    }

}