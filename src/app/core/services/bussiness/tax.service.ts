import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ITax, ITaxPayload } from '../../interfaces/bussiness/tax.interface';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

    private taxesMock: ITax[]  = [
        {
            id: '1',
            name: 'IVA 19%',
            percentage: 19,
            type: 'added',
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getAllSuppliers(userId: string): Observable<ITax[]> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.taxesMock).pipe(delay(3000));
    }

    public saveSupplier(newTax: ITaxPayload): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        return of(true).pipe(delay(3000));
    }

}