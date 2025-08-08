import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOrder } from '../../interfaces/bussiness/order.interface';
import { IProduct, IProductPayload } from '../../interfaces/bussiness/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    private productsMock: IProduct[]  = [
        {
            id: '1',
            name: 'Laptop Lenovo',
            description: 'Laptop de 15 pulgadas con 8GB RAM Y 256 SDD',
            costPrice: 500,
            salePrice: 750,
            stock: 20,
            category: {
                id: '1',
                name: 'Electronica',
                description: 'Productos de electronica',
            },
            supplierId: {
                id: '1',
                name: 'Proveedor 111',
                phone: '30467911101',
                email: 'provedor111@gmail.com',
                address: 'Cll 12 #7-135',
            },
            tax: {
                id: '1',
                name: 'IVA 19%',
                percentage: 19,
                type: 'added',
            },
            images: [
                "https://ionicframework.com/docs/img/demos/thumbnail.svg"
            ]
        },
        {
            id: '2',
            name: 'Epson L455',
            description: 'Impresora Epson L455 cartuchos',
            costPrice: 700,
            salePrice: 1500,
            stock: 9,   
            category: {
                id: '1',
                name: 'Electronica',
                description: 'Productos de electronica',
            },
            supplierId: {
                id: '1',
                name: 'Proveedor 111',
                phone: '30467911101',
                email: 'provedor111@gmail.com',
                address: 'Cll 12 #7-135',
            },
            tax: {
                id: '1',
                name: 'IVA 19%',
                percentage: 19,
                type: 'added',
            },
            images: []
        }
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getAllProducts(userId: string): Observable<IProduct[]> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.productsMock).pipe(delay(3000));
    }

    public saveProduct(newProduct: IProductPayload): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        return of(true).pipe(delay(3000));
    }

}