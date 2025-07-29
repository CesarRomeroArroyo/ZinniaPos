import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IProductCategory, IProductCategoryPayload } from '../../interfaces/bussiness/product-category.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

    private categoriesMock: IProductCategory[]  = [
        {
            id: '1',
            name: 'Electronica',
            description: 'Productos de electronica',
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getAllCategories(userId: string): Observable<IProductCategory[]> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.categoriesMock).pipe(delay(3000));
    }

    public saveCategory(newCategory: IProductCategoryPayload): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        return of(true).pipe(delay(3000));
    }

}