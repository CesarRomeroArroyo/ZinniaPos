import { delay, lastValueFrom, Observable, of, throwError } from 'rxjs';
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
            userId: '2222',
            name: 'Clinica la Concepcion',
            address: 'Calle 12 #7-235',
            mobile: '3116791102',
            email: 'clinicaconcepcion.@concepcion.edu.co',
            ruc: "298862",
            category: BusinessCategoryId.HEALTH,
        },
        {
            id: '2',
            userId: '33202',
            name: 'Confecciones Delta',
            address: 'Calle 15 #8-222',
            mobile: '3046781191',
            email: 'deltard@hotmail.com',
            ruc: '2988111',
            category: BusinessCategoryId.RETAIL,
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
        const companyFound = this.companiesMock.find(company => company.userId === userId);
        if (!companyFound) {
            return throwError(() => new Error(`Company not found for user`));
        }
        return of(companyFound).pipe(delay(2000));
    }

}