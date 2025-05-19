import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICustomer } from '../../interfaces/bussiness/customers.interface';
import { IEmailVerifyResponse } from '../../interfaces/bussiness/verify.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private registeredUsers: any[]  = [
        {
            id: 1,
            fullname: 'Jorge Luis Mendez',
            email: 'jorge.mendezj@cecar.edu.co',
            password: '123',
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

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

}