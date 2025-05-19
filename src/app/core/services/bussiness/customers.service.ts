import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICustomer } from '../../interfaces/bussiness/customers.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

    private customersMock: ICustomer[]  = [
        {
            id: 1,
            fullname: 'Jorge Luis Mendez',
            email: 'jorge.mendezj@cecar.edu.co',
            mobile: '3046791101',
            address: '3046791101'
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getCustomers(userId: string): Observable<ICustomer[]> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.customersMock).pipe(delay(3000));
    }

    public saveCustomer(newCustomer: ICustomer): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        this.customersMock.push(newCustomer);
        return of(true).pipe(delay(3000));
    }

}