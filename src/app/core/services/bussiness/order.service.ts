import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOrder, IOrderPayload } from '../../interfaces/bussiness/order.interface';
import { OrderStatusValue, OriginOfOrder } from '../../consts/enums/business/order.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    private ordersMock: IOrder[]  = [
        {
            id: '1',
            customer: {
                id: '1',
                fullname: 'Adalberto Fabra Rodriguez',
                email: 'adalberto.fabra@cecar.edu.co',
                mobile: '3116791102',
                address: 'Calle 12 #7-235'
            },
            items: [
                {
                    id: '1',
                    product: {
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
                        images: []
                    },
                    quantity: 2,
                }
            ],
            discounut: {
                id: '1',
                type: 'percentage',
                value: 20,
                reason: 'Descuento dia del padre',
            },
            estimatedTax: 145,
            subtotal: 765,
            total: 910,
            status: OrderStatusValue.PENDING,
            origin: OriginOfOrder.WHATSAPP,
            createAt: '2025-08-07T23:13:36.000000Z',
            updateAt: '2025-01-07T23:13:36.000000Z'
        },
        {
            id: '2',
            customer: {
                id: '1',
                fullname: 'Adalberto Fabra Rodriguez',
                email: 'adalberto.fabra@cecar.edu.co',
                mobile: '3116791102',
                address: 'Calle 12 #7-235'
            },
            items: [
                {
                    id: '1',
                    product: {
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
                        images: []
                    },
                    quantity: 2,
                }
            ],
            discounut: {
                id: '1',
                type: 'percentage',
                value: 20,
                reason: 'Descuento dia del padre',
            },
            estimatedTax: 145,
            subtotal: 765,
            total: 910,
            status: OrderStatusValue.PENDING,
            origin: OriginOfOrder.APPLICATION,
            createAt: '2025-08-06T23:19:36.000000Z',
            updateAt: '2025-01-06T23:19:36.000000Z'
        },
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getAllOrders(userId: string): Observable<IOrder[]> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.ordersMock).pipe(delay(3000));
    }

    public saveOrder(newOrder: IOrderPayload): Observable<boolean> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        return of(true).pipe(delay(3000));
    }

}