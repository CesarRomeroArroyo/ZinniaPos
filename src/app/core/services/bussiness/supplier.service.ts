import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ISupplier, ISupplierPayload } from '../../interfaces/bussiness/supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

    private suppliersMock: ISupplier[]  = [
        {
            id: '1',
            name: 'Proveedor 111',
            phone: '30467911101',
            email: 'provedor111@gmail.com',
            address: 'Cll 12 #7-135',
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getAllSuppliers(userId: string): Observable<ISupplier[]> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.suppliersMock).pipe(delay(3000));
    }

    public saveSupplier(newSupplier: ISupplierPayload): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        return of(true).pipe(delay(3000));
    }

}