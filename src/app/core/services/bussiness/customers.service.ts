import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICustomer, ICustomerPayload } from '../../interfaces/bussiness/customers.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

    private customersMock: ICustomer[]  = [
        {
            id: '1',
            fullname: 'Adalberto Fabra Rodriguez',
            email: 'adalberto.fabra@cecar.edu.co',
            mobile: '3116791102',
            address: 'Calle 12 #7-235'
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

    public saveCustomer(newCustomer: ICustomerPayload): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        this.customersMock.push(newCustomer);
        return of(true).pipe(delay(3000));
    }

}