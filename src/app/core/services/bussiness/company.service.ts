import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICompany } from '../../interfaces/bussiness/company.interface';
import { BusinessCategoryId } from '../../consts/enums/business/business-category.enum';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    private companiesMock: ICompany[]  = [
        {
            id: "1",
            name: 'Clinica la Concepcion',
            address: 'Calle 12 #7-235',
            mobile: '3116791102',
            email: 'adalberto.fabra@cecar.edu.co',
            ruc: "298862",
            category: BusinessCategoryId.HEALTH,
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getCompanyByUser(userId: string): Observable<ICompany> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.companiesMock[0]).pipe(delay(2000));
    }

}